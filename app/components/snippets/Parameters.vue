<template>

</template>
<script lang="ts">
import type { Metadata } from '~/utils/snippets/metadata';
import * as YAML from "yaml";

const props = defineProps<{ snippetKey: string }>()
// --------------------
// Refs
// --------------------
const outputME = useTemplateRef("outputME")
const snippetCode = ref("");
const meta = ref<Metadata>({} as Metadata)
const metaRaw = ref<YAML.Document | undefined>(undefined)
const snippetKeyRef = ref(props.snippetKey)
watch(() => props.snippetKey, () => snippetKeyRef.value = props.snippetKey)

const inputParsed = shallowRef({});
const output = ref("");
const outputLang = ref("plaintext");

// Watch
watch(() => props.snippetKey, async () => {
    if (!import.meta.client) return
    const snippet = await getSnippet(props.snippetKey)
    const metaNewRaw = await getMetadataSchema(props.snippetKey)
    const metaNew = await getMetadata(props.snippetKey)
    snippetCode.value = snippet
    outputLang.value = metaNew.lang
    meta.value = metaNew
    metaRaw.value = metaNewRaw
}, { immediate: true })
</script>