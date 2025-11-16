<script setup lang="ts">
function onKeyDown(e: KeyboardEvent) {
    if (e.code.toLowerCase() == 'space') {
        e.preventDefault();
        (e.target as HTMLAnchorElement).click();
    }
}
defineProps<{ notNuxtLink?: boolean }>()
</script>
<template>
    <NuxtLink v-if="!notNuxtLink" @keydown="onKeyDown">
        <slot></slot>
    </NuxtLink>
    <a v-else @keydown="onKeyDown">
        <slot></slot>
    </a>
</template>