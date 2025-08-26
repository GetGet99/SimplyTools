<script setup lang="ts">
    import { createNewSnippet } from '~/utils/snippets/manager';

    if (import.meta.client) {

        const remix = useRequestURL().searchParams.get('remix') ?? 'builtin.examples.item'
        navigateTo(`/snippets/edit?id=${encodeURIComponent(await createNewSnippet(remix))}`, { replace: true })
    }
</script>
<template>
    <noscript>JavaScript is required for this operaton.</noscript>
    Creating... Please wait
</template>