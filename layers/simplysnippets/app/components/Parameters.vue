<template>

</template>
<script lang="ts">
import { getMetadataAsync, getMetadataSchemaAsync, getSnippetAsync } from '../lib/manager';
import type { Metadata } from '../lib/metadata';
import * as YAML from "yaml";

const props = defineProps<{ snippetKey: string }>()
// --------------------
// Refs
// --------------------
const snippetCode = ref("");
const meta = ref<Metadata>({} as Metadata)
const metaRaw = ref<YAML.Document | undefined>(undefined)
const snippetKeyRef = ref(props.snippetKey)
watch(() => props.snippetKey, () => snippetKeyRef.value = props.snippetKey)

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
</script>