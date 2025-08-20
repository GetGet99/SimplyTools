<script setup lang="ts">
    import './app.css'
    useHead({ bodyAttrs: { class: 'scheme-dark'}})
</script>
<template>
    <div class="w-screen min-h-screen bg-root text-foreground">
        <NuxtPage />
    </div>
</template>
