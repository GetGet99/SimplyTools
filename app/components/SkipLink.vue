<script setup lang="ts">
defineProps<{to?: 'main' | 'selected-navigation-item'}>()
</script>
<template>
    <Control variant="regular"
        class="col-span-2 fixed z-1000 bg-solid-primary border-accent-primary top-titlebar-height -left-100 -translate-x-1/2 focus:left-1/2 transition-transform duration-100">
        <OurLink not-nuxt-link :href="`#${to ?? 'main'}`" class="manual">Press Enter or Space to skip to {{ (to ?? 'main') === 'main' ? 'main content' : 'selected navigation item' }}.</OurLink>
    </Control>
</template>