<script setup lang="ts">
    import './app.css'
    import 'vue-color/style.css'
    useHead({ bodyAttrs: { class: 'scheme-dark'}})
</script>
<template>
    <div class="w-full min-h-screen bg-root text-foreground">
        <NuxtPage />
    </div>
</template>
