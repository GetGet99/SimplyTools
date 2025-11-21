<script setup lang="ts">
export type ErrorToastPayload = {
    type: 'error'
    error: string
};
defineProps<ErrorToastPayload>()
</script>
<template>
    <ToastRoot class="toast-item bg-critical p-4 grid grid-cols-[minmax(0,_1fr)_auto] gap-1 w-100 rounded-2">
        <ToastTitle class="font-bold">Error</ToastTitle>
        <ToastClose as-child>
            <Button class="my-auto row-span-2">Dismiss</Button>
        </ToastClose>
        <ToastDescription class="text-sm">
            {{ error }}
        </ToastDescription>
    </ToastRoot>
</template>