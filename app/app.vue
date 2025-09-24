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
        <ToastProvider :duration="7500">
            <ToastsGenerator>
                <NuxtPage />
            </ToastsGenerator>
            <Flex as-child column class="fixed bottom-0 right-0 gap-2 p-6">
                <ToastViewport />
            </Flex>
        </ToastProvider>
    </div>
</template>
