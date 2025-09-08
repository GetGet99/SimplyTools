<script setup lang="ts">
import { Apps } from '~/utils/pages/app';
usePageInfo(Apps.pages.find(x => x.path === 'snippets'))
import { createNewSnippet } from '~/utils/snippets/manager';
if (import.meta.client) {

    const remix = useRequestURL().searchParams.get('remix') ?? 'builtin.examples.item'
    navigateTo(`/snippets/edit?id=${encodeURIComponent(await createNewSnippet(remix))}`, { replace: true })
}
</script>
<template>
    <title-bar />
    <noscript>JavaScript is required for this operaton.</noscript>
    Creating... Please wait
</template>