<script setup lang="ts">
    import './app.css'
    useHead({
        bodyAttrs: {
            style: {
                'color-scheme': 'dark light'
            }
        }
    })
</script>
<template>
    <div class="w-full min-h-screen bg-root text-foreground">
        <NuxtPage />
    </div>
</template>
