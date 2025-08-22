<script setup lang="ts">
    function onKeyDown(e : KeyboardEvent) {
        if (e.code.toLowerCase() == 'space') {
            e.preventDefault();
            (e.target as HTMLAnchorElement).click();
        }
    }
</script>
<template>
    <NuxtLink @keydown="onKeyDown">
        <slot></slot>
    </NuxtLink>
</template>