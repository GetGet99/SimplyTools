<template>
    <DialogRoot>
        <div class="snippet-viewer-root" :class>
            <div class="flex gap-2 items-center lg:-order-1">
                <label class="font-bold">Input</label>
                <div class="grow"></div>
                <SnippetsViewerButtons class="lg:hidden" :snippet-key :snippet-code />
            </div>
            <!-- Input -->
            <CodeEditor lang="yaml" v-model="input" class="not-lg:min-h-50" />

            <!-- Input Format -->
            <label class="font-bold flex items-center lg:order-1">Input Format</label>
            <CodeEditor lang="yaml" readonly :model-value="YAML.stringify(meta.properties)"
                class="not-lg:min-h-50 lg:order-1" />

            <div class="flex gap-2 items-center lg:-order-1">
                <label class="font-bold">Output</label>
                <div class="grow"></div>
                <SnippetsViewerButtons class="not-lg:hidden" :snippet-key :snippet-code />
            </div>
            <!-- Output Preview -->
            <ClientOnly>
                <CodeEditor ref="outputME" :lang="outputLang" readonly v-model="output"
                    class="row-span-3 not-lg:min-h-50" />
            </ClientOnly>

        </div>
        <ContentDialogPortal title="Template Source" class="w-[70vw] max-w-[70vw] h-[70vh] max-h-[70vh]">
            <SnippetsEditor readonly class="grow" v-model="snippetCode" />
        </ContentDialogPortal>
    </DialogRoot>
</template>
<style scoped>
    @reference '../../app.css';

    .snippet-viewer-root {
        @apply grid gap-2 overflow-hidden;

        @variant lg {
            @apply grid-cols-2 min-h-100;
            grid-template-rows: auto minmax(0, 2fr) auto minmax(0, 1fr);
        }

        @variant xl {
            @apply min-h-[unset];
        }
    }
</style>

<script setup lang="ts">
    import * as YAML from "yaml";
    import { Liquid } from "liquidjs";
    import { extractYamlComment, type Metadata } from "~/utils/snippets/metadata";
    import { getMetadata, getSnippet } from "~/utils/snippets/manager";

    const props = defineProps<{ snippetKey: string, class?: string }>()


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
