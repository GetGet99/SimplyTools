<template>
    <DialogRoot>
        <Grid class="snippet-viewer-root gap-2 overflow-hidden" :class>
            <Flex class="gap-2 items-center lg:-order-1">
                <label class="font-bold">Input</label>
                <Grow />
                <SimplySnippetsViewerButtons class="lg:hidden" :snippet-key :snippet-code />
            </Flex>

            <!-- Input Tabs -->
            <Flex column class="gap-2 not-lg:min-h-50" :class="inputTab === 'form' ? 'lg:row-span-3' : ''">
                <NavigationTabs v-model="inputTab" :options="['form', 'yaml', 'json']" v-slot="{ option }">
                    <span v-if="option === 'form'">UI</span>
                    <span v-else-if="option === 'yaml'">YAML</span>
                    <span v-else-if="option === 'json'">JSON</span>
                </NavigationTabs>
                <!-- Form Tab -->
                <ClientOnly>
                    <SimplySnippetsFormBuilder v-if="inputTab === 'form' && properties" :properties="properties"
                        :meta-raw="metaRaw" v-model="input" class="overflow-y-auto" />
                    <div v-else-if="inputTab === 'form' && !properties"
                        class="flex items-center justify-center text-muted-foreground min-h-50">
                        Loading...
                    </div>
                </ClientOnly>

                <!-- YAML Tab -->
                <InputTextBoxTools v-if="inputTab === 'yaml'" v-model="input" class="not-lg:min-h-50 h-full" >
                    <CodeEditor lang="yaml" v-model="input" />
                </InputTextBoxTools>

                <!-- JSON Tab -->
                <InputTextBoxTools v-if="inputTab === 'json'" :model-value="inputJson" @update:model-value="updateFromJson" class="not-lg:min-h-50 h-full" >
                    <CodeEditor v-if="inputTab === 'json'" lang="json" :model-value="inputJson"
                        @update:model-value="updateFromJson" />
                </InputTextBoxTools>
            </Flex>

            <!-- Input Format (only show for YAML and JSON tabs) -->
            <template v-if="inputTab !== 'form'">
                <label class="font-bold flex items-center lg:order-1">Input Format</label>
                <CodeEditor lang="yaml" readonly :model-value="String(new YAML.Document(metaRaw?.get('properties')))"
                    class="not-lg:min-h-50 lg:order-1" />
            </template>

            <Flex class="gap-2 items-center lg:-order-1">
                <label class="font-bold">Output</label>
                <Grow />
                <SimplySnippetsViewerButtons class="not-lg:hidden" :snippet-key :snippet-code />
            </Flex>
            <!-- Output Preview -->
            <ClientOnly>
                <OutputTextBoxTools :output="output" :filename-hint="`output.${fileExtension}`"
                    class="lg:row-span-3 not-lg:min-h-50">
                    <CodeEditor ref="outputME" :lang=outputLang readonly v-model="output"
                        class="lg:row-span-3 not-lg:min-h-50" />
                </OutputTextBoxTools>
            </ClientOnly>

        </Grid>
        <ContentDialogPortal title="Template Source" class="w-[70vw] max-w-[70vw] h-[70vh] max-h-[70vh]">
            <SimplySnippetsEditor readonly class="grow h-full" v-model="snippetCode" />
        </ContentDialogPortal>
    </DialogRoot>
</template>
<style scoped>
@reference '~~/layers/simplytools-ui/app/app.css';

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
import { type Metadata } from "../lib/metadata";
import { getMetadataAsync, getMetadataSchemaAsync, getSnippetAsync, useSavedInput } from "../lib/manager";
import { useLiquidEngine } from "../lib/liquid/engine";

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
const inputTab = ref<'form' | 'yaml' | 'json'>('form');

// Extract properties from meta
const properties = computed(() => {
    if (!meta.value || !meta.value.properties) return null
    return meta.value.properties as Record<string, any>
})

// Convert input to JSON for JSON tab
const inputJson = computed(() => {
    if (!input.value) return ''
    try {
        const parsed = YAML.parse(input.value)
        return JSON.stringify(parsed, null, 2)
    } catch {
        return ''
    }
})

// Update input from JSON tab
function updateFromJson(jsonValue: string | undefined) {
    if (!jsonValue) return
    try {
        const parsed = JSON.parse(jsonValue)
        input.value = YAML.stringify(parsed)
    } catch (err) {
        // Invalid JSON, ignore
    }
}

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
const engine = useLiquidEngine();
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
        const out = await engine.parseAndRender(template, vars);
        output.value = out;

    } catch (err: any) {
        output.value = `⚠️ Error: ${err.message}`;
    }
}

// Watch editors
watch([snippetCode, input], render, { immediate: true });

const fileExtension = computed(() => {
    const lang = outputLang.value
    switch (lang) {
        case 'plaintext':
            return 'txt'
        case 'javascript':
            return 'js'
        case 'typescript':
            return 'ts'
        case 'python':
            return 'py'
        case 'csharp':
            return 'cs'
        case 'json':
        case 'yaml':
        case 'html':
        case 'css':
            return lang
        default:
            return 'txt'
    }
})
</script>
