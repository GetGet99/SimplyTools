<script setup lang="ts">
usePageInfo(Apps.pages.find(x => x.path === 'snippets'))
import { createNewListAsync } from '~/utils/random/listManager';
if (import.meta.client) {
    const remix = useRequestURL().searchParams.get('remix') as UUID | null
    navigateTo(`/random/list/${encodeURIComponent(await createNewListAsync(remix ?? undefined))}/edit`, { replace: true })
}
</script>
<template>
    <title-bar />
    <noscript>JavaScript is required for this operaton.</noscript>
    Creating... Please wait
</template>