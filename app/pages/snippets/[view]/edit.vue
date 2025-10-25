<template>
    <Grid :columns="2" :rows="2" class="gap-4 h-screen overflow-hidden p-2">
        <!-- Template Editor -->
        <Flex column class="gap-2 row-span-2">
            <label class="font-bold p-button px-0">Template (autosaved)</label>
            <SnippetsEditor class="grow" v-model="code" />
        </Flex>

        <!-- Test Input Editor -->
        <Flex column class="gap-2">
            <Flex class="items-center gap-1">
                <label class="font-bold">Test Input (won't be saved)</label>
                <Grow />
                <Control>
                    <OurLink class="manual flex gap-1 pl-2" :href="`/snippets/${view}`">
                        <Icon alt="" :icon=View />
                        View in Main App
                    </OurLink>
                </Control>
            </Flex>
            <CodeEditor lang="yaml" v-model="input" class="grow" />
        </Flex>

        <!-- Output Preview -->
        <Flex column class="gap-2">
            <label class="font-bold p-button px-0">Preview Output using Test Input</label>
            <CodeEditor ref="outputME" :lang=outputLang readonly v-model="output" :model-uri="uri" class="grow" />
        </Flex>
    </Grid>
</template>

<script setup lang="ts">
import { Apps } from '~/utils/pages/app';
import View from '@fluentui/svg-icons/icons/eye_24_regular.svg?raw'
import * as YAML from "yaml";
import { Liquid } from "liquidjs";
import { extractYamlComment, type Metadata } from "~/utils/snippets/metadata";
import type { Uri } from "monaco-editor";
import { getMetadataAsync, getMetadataExampleAsync, useLocalSnippetRefAsync } from "~/utils/snippets/manager";
// --------------------
// Refs
// --------------------
let uri = undefined
if (import.meta.client) {
    uri = 'inmemory://index.liquid' as any as Uri
}
const outputME = useTemplateRef("outputME")
let code: Ref<string>;

const input = ref(``);
const output = ref("");
const outputLang = ref("plaintext");
let isMounted = true


const url = useRoute()
const view = computed(() => url.params.view as string)
onUnmounted(() => {
    isMounted = false
})
const item = Apps.pages.find(x => x.path === 'snippets')!
usePageInfo(item)
getMetadataAsync(view.value).then(x => {
    if (!isMounted) return
    usePageInfo({
        ...item,
        breadcrumb: [
            {
                type: 'link',
                href: `/snippets/${view.value}`,
                text: x.name
            }
        ]
    })
})
// Client Only Area
if (import.meta.client) {
    if (view.value === null) {
        throw createError({ status: 404, statusText: 'Snippet not found' })
    }
    code = await useLocalSnippetRefAsync(view.value)
    input.value = await getMetadataExampleAsync(view.value)
} else {
    code = ref('')
}

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
            outputLang.value = meta.lang
        } catch {

        }
    }, { immediate: true });
}
</script>
