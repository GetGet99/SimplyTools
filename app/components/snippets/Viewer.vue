<template>
    <DialogRoot>
        <Grid class="snippet-viewer-root gap-2 overflow-hidden" :class>
            <Flex class="gap-2 items-center lg:-order-1">
                <label class="font-bold">Input</label>
                <Grow />
                <SnippetsViewerButtons class="lg:hidden" :snippet-key :snippet-code />
            </Flex>
            <!-- Input -->
            <CodeEditor lang="yaml" v-model="input" class="not-lg:min-h-50" />

            <!-- Input Format -->
            <label class="font-bold flex items-center lg:order-1">Input Format</label>
            <CodeEditor lang="yaml" readonly :model-value="String(new YAML.Document(metaRaw?.get('properties')))"
                class="not-lg:min-h-50 lg:order-1" />

            <Flex class="gap-2 items-center lg:-order-1">
                <label class="font-bold">Output</label>
                <Grow />
                <SnippetsViewerButtons class="not-lg:hidden" :snippet-key :snippet-code />
            </Flex>
            <!-- Output Preview -->
            <ClientOnly>
                <CodeEditor ref="outputME" :lang=outputLang readonly v-model="output"
                    class="row-span-3 not-lg:min-h-50" />
            </ClientOnly>

        </Grid>
        <ContentDialogPortal title="Template Source" class="w-[70vw] max-w-[70vw] h-[70vh] max-h-[70vh]">
            <SnippetsEditor readonly class="grow" v-model="snippetCode" />
        </ContentDialogPortal>
    </DialogRoot>
</template>
<style scoped>
    @reference '../../app.css';

    .snippet-viewer-root {
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
    import { type Metadata } from "~/utils/snippets/metadata";
    import { getMetadataAsync, getMetadataSchemaAsync, getSnippetAsync, useSavedInput } from "~/utils/snippets/manager";

    const props = defineProps<{ snippetKey: string, class?: string }>()


    // --------------------
    // Refs
    // --------------------
    const outputME = useTemplateRef("outputME")
    const snippetCode = ref("");
    const meta = ref<Metadata>({} as Metadata)
    const metaRaw = ref<YAML.Document | undefined>(undefined)
    const snippetKeyRef = ref(props.snippetKey)
    watch(() => props.snippetKey, () => snippetKeyRef.value = props.snippetKey)
    const input = import.meta.client ? await useSavedInput(snippetKeyRef) : ref("");
    const output = ref("");
    const outputLang = ref("plaintext");

    // Watch
    watch(() => props.snippetKey, async () => {
        if (!import.meta.client) return
        const snippet = await getSnippetAsync(props.snippetKey)
        const metaNewRaw = await getMetadataSchemaAsync(props.snippetKey)
        const metaNew = await getMetadataAsync(props.snippetKey)
        snippetCode.value = snippet
        outputLang.value = metaNew.lang
        meta.value = metaNew
        metaRaw.value = metaNewRaw
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
</script>
