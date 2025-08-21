<script setup lang="ts">
    import './app.css'
    useHead({
        bodyAttrs: {
            style: {
                colorScheme: 'dark light'
            }
        }
    })
</script>
<template>
    <div class="w-full min-h-screen bg-root text-foreground">
        <NuxtPage />
    </div>
</template>
