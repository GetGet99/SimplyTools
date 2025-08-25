<template>
    <div class="grid grid-cols-2 grid-rows-[auto_minmax(0_,2fr)_minmax(0_,1fr)] gap-2 overflow-hidden">
        <label class="font-bold flex items-center">Input</label>
        <div class="flex gap-2 items-center">
            <label class="font-bold">Output</label>
            <div class="grow"></div>
            <DialogRoot>
                <DialogTrigger as-child>
                    <Button class="flex gap-1">
                        Template Source
                        <Icon alt="" :icon=OpenPopup />
                    </Button>
                </DialogTrigger>
                <DialogPortal class="flex w-screen h-screen justify-center items-center">
                    <DialogOverlay
                        class="data-[state=open]:bg-smoke absolute top-0 bottom-0 left-0 right-0" />
                    <DialogContent class="absolute top-1/2 left-1/2 -translate-1/2 w-[70vw] h-[70vh] p-5 bg-black flex flex-col">
                        <DialogTitle class="flex">
                            Template Source
                            <div class="grow"></div>
                            <DialogClose aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </DialogClose>
                        </DialogTitle>
                        <SnippetsEditor readonly class="grow" v-model="code" />
                    </DialogContent>
                </DialogPortal>
            </DialogRoot>
            <!-- <Button>Remix</Button> -->
        </div>
        <!-- Test Input Editor -->
        <MonacoEditor lang="yaml" :options="{
            theme: 'simplytools',
            minimap: { enabled: false }
        }" v-model="input" class="grow bg-control-primary" />

        <!-- Output Preview -->
        <MonacoEditor ref="outputME" lang="plaintext" :options="{
            theme: 'simplytools',
            minimap: { enabled: false },
            readOnly: true
        }" v-model="output" :model-uri="uri" class="grow bg-control-primary" />

        <!-- Template Editor -->
        <div class="flex flex-col gap-2 col-span-2">
            <label class="font-bold">Template</label>
        </div>
    </div>
</template>

<script setup lang="ts">
    import OpenPopup from '@fluentui/svg-icons/icons/open_24_regular.svg?raw'
    import * as YAML from "yaml";
    import { Context, Liquid, Tag, TagToken, type TopLevelToken } from "liquidjs";
    import { extractYamlComment, yamlToZod, type Metadata } from "~/utils/snippets/metadata";
    import type { Uri } from "monaco-editor";
    let uri = undefined
    if (import.meta.client)
        uri = 'inmemory://index.liquid' as any as Uri

    import { getMetadata, getSnippet } from "~/utils/snippets/manager";

    const props = defineProps<{ snippetKey: string }>()


    // --------------------
    // Refs
    // --------------------
    const outputME = useTemplateRef("outputME")
    const code = ref("");

    const input = ref("");
    const output = ref("");

    // Watch
    watch(() => props.snippetKey, async () => {
        const snippet = await getSnippet(props.snippetKey)
        const initialMeta = await getMetadata(props.snippetKey)
        code.value = snippet
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
            const template = code.value.replace(
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
    watch([code, input], render, { immediate: true });
    if (import.meta.client) {
        const monaco = await useMonaco()
        watch(code, async () => {
            try {
                const yaml = extractYamlComment(code.value)
                const meta = YAML.parse(yaml ?? '') as Metadata

                monaco.editor.setModelLanguage(outputME.value?.$editor?.getModel()!, meta.lang)
            } catch {

            }
        }, { immediate: true });
    }
</script>
