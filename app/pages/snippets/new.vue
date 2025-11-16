<script setup lang="ts">
import { Apps } from '~/utils/pages/app';
usePageInfo(Apps.pages.find(x => x.path === 'snippets'))
import { createNewSnippetAsync } from './lib/manager';
if (import.meta.client) {

    const remix = useRequestURL().searchParams.get('remix') ?? 'builtin.examples.item'
    navigateTo(`/snippets/${encodeURIComponent(await createNewSnippetAsync(remix))}/edit`, { replace: true })
}
</script>
<template>
    <title-bar />
    <noscript>JavaScript is required for this operaton.</noscript>
    Creating... Please wait
</template>