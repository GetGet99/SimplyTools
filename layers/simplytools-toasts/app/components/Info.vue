<script setup lang="ts">
export type InfoToastPayload = {
    type: 'info'
    title: string
    desc: string
    dismissable: boolean
};
defineProps<InfoToastPayload>()
</script>
<template>
    <ToastRoot class="toast-item bg-critical p-4 grid grid-cols-[minmax(0,_1fr)_auto] gap-1 w-100 rounded-2">
        <ToastTitle class="font-bold">{{ title }}</ToastTitle>
        <ToastClose as-child>
            <Button class="my-auto row-span-2" v-if="dismissable">Dismiss</Button>
        </ToastClose>
        <ToastDescription class="text-sm">
            {{ desc }}
        </ToastDescription>
    </ToastRoot>
</template>