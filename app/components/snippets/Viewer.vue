<template>
    <div class="grid grid-cols-2 grid-rows-[auto_minmax(0_,2fr)_auto_minmax(0_,1fr)] gap-2 overflow-hidden">
        <label class="font-bold flex items-center">Input</label>
        <div class="flex gap-2 items-center">
            <label class="font-bold">Output</label>
            <div class="grow"></div>
            <DialogRoot>
                <DialogPortal class="flex w-screen h-screen justify-center items-center">
                    <DialogOverlay class="data-[state=open]:bg-smoke absolute top-0 bottom-0 left-0 right-0" />
                    <DialogContent
                        class="absolute top-1/2 left-1/2 -translate-1/2 w-[70vw] h-[70vh] p-5 bg-black flex flex-col">
                        <DialogTitle class="flex">
                            Template Source
                            <div class="grow"></div>
                            <DialogClose aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </DialogClose>
                        </DialogTitle>
                        <SnippetsEditor readonly class="grow" v-model="snippetCode" />
                    </DialogContent>
                </DialogPortal>
            </DialogRoot>
            <ContentDialog title="Template Source" class="w-[70vw] max-w-[70vw] h-[70vh] max-h-[70vh]">
                <template #trigger>
                    <DialogTrigger as-child>
                        <Button class="flex gap-1">
                            Template Source
                            <Icon alt="" :icon=OpenPopup />
                        </Button>
                    </DialogTrigger>
                </template>
                <SnippetsEditor readonly class="grow" v-model="snippetCode" />
            </ContentDialog>
            <Control varient="accent" class="hidden">
                <OurLink class="manual" :href="`/snippets/edit?remix=${encodeURIComponent(snippetKey)}`">
                    Remix
                </OurLink>
            </Control>
        </div>
        <!-- Test Input Editor -->
        <CodeEditor lang="yaml" v-model="input" />

        <!-- Output Preview -->
        <CodeEditor ref="outputME" :lang="outputLang" readonly v-model="output" class="row-span-3 bg-control-primary" />

        <!-- Parameters -->
        <label class="font-bold flex items-center">Input Format</label>
        <CodeEditor lang="yaml" readonly :model-value="YAML.stringify(meta.properties)" />
    </div>
</template>

<script setup lang="ts">
    import OpenPopup from '@fluentui/svg-icons/icons/open_24_regular.svg?raw'
    import * as YAML from "yaml";
    import { Liquid } from "liquidjs";
    import { extractYamlComment, type Metadata } from "~/utils/snippets/metadata";
    import { getMetadata, getSnippet } from "~/utils/snippets/manager";

    const props = defineProps<{ snippetKey: string }>()


    // --------------------
    // Refs
    // --------------------
    const outputME = useTemplateRef("outputME")
    const snippetCode = ref("");
    const meta = ref<Metadata>({} as Metadata)

    const input = ref("");
    const output = ref("");
    const outputLang = ref("plaintext");

    // Watch
    watch(() => props.snippetKey, async () => {
        const snippet = await getSnippet(props.snippetKey)
        const initialMeta = await getMetadata(props.snippetKey)
        snippetCode.value = snippet
        outputLang.value = initialMeta.lang
        meta.value = initialMeta
        input.value = YAML.stringify(initialMeta.example)
    }, { immediate: true })

    // --------------------
    // Liquid Engine
    // --------------------
    const engine = import.meta.client ? new Liquid() : undefined;
    if (engine) {
        engine.registerTag('meta', {
            parse: function (tagToken, remainTokens) {
                this.templates = []

                let token
                const stream = engine.parser.parseStream(remainTokens)
                stream.on('tag:endmeta', () => {
                    stream.stop()
                })
                    .on('template', (tpl) => {
                        this.templates.push(tpl)
                    })
                stream.start()
            },

            render: function* (ctx, hash) {
                // Just like comment: don't render anything
                return ''
            }
        })

    }
    // --------------------
    // Watch and Render
    // --------------------
    async function render() {
        if (!engine) return
        try {
            // Parse YAML input
            const vars = input.value ? YAML.parse(input.value) : {};

            // Remove comment block before rendering
            const template = snippetCode.value.replace(
                /{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}/g,
                ""
            );

            // Render with Liquid
            output.value = await engine.parseAndRender(template, vars);

        } catch (err: any) {
            output.value = `⚠️ Error: ${err.message}`;
        }
    }

    // Watch editors
    watch([snippetCode, input], render, { immediate: true });
    if (import.meta.client) {
        const monaco = await useMonaco()
        watch(outputLang, () => {
            monaco.editor.setModelLanguage(outputME.value?.editor?.getModel()!, outputLang.value)
        })
        watch(snippetCode, async () => {
            try {
                const yaml = extractYamlComment(snippetCode.value)
                const meta = YAML.parse(yaml ?? '') as Metadata
            } catch {

            }
        }, { immediate: true });
    }
</script>
