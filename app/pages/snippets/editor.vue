<template>
    <div class="grid grid-cols-2 grid-rows-2 gap-2 h-screen overflow-hidden">
        <ClientOnly>
            <!-- Template Editor -->
            <div class="flex flex-col gap-2 row-span-2">
                <label class="font-bold">Template</label>
                <SnippetsEditor class="grow" v-model="code" />
            </div>

            <!-- Test Input Editor -->
            <div class="flex flex-col gap-2">
                <label class="font-bold">Test Input</label>
                <MonacoEditor lang="yaml" :options="{
                    theme: 'simplytools',
                    minimap: { enabled: false }
                }" v-model="input" class="grow bg-control-primary" />
            </div>

            <!-- Output Preview -->
            <div class="flex flex-col gap-2">
                <label class="font-bold">Output</label>
                <MonacoEditor ref="outputME" lang="plaintext" :options="{
                    theme: 'simplytools',
                    minimap: { enabled: false },
                    readOnly: true
                }" v-model="output" :model-uri="uri" class="grow bg-control-primary" />
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
    import * as YAML from "yaml";
    import { Context, Liquid, Tag, TagToken, type TopLevelToken } from "liquidjs";
    import { extractYamlComment, yamlToZod, type Metadata } from "~/utils/snippets/metadata";
    import type { Uri } from "monaco-editor";
    // --------------------
    // Refs
    // --------------------
    let uri = undefined
    if (import.meta.client)
        uri = 'inmemory://index.liquid' as any as Uri
    const outputME = useTemplateRef("outputME")
    const code = ref(``);

    const input = ref(``);
    const output = ref("");

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
