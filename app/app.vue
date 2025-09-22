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
            <ToastViewport class="fixed bottom-0 right-0 flex flex-col gap-2 p-6" />
        </ToastProvider>
    </div>
</template>
