<script setup lang="ts">
export type ProgressToastPayload = {
    type: 'progress'
    title: string
    progress: number
    duration: number
};
const props = defineProps<ProgressToastPayload>()
const open = ref(true)
let timeout : NodeJS.Timeout | undefined = undefined
watch(() => props.progress, () => {
    if (props.progress >= 1 && !timeout) {
        timeout = setTimeout(() => {
            open.value = false
        }, props.duration)
    }
})
</script>
<template>
    <ToastRoot class="toast-item bg-info p-4 grid grid-cols-[minmax(0,_1fr)_auto] gap-1 w-100 rounded-2" :duration="Infinity" :open>
        <ToastTitle class="font-bold">{{ title }}</ToastTitle>
        <ToastDescription class="text-sm">
            {{ Math.floor(Math.max(Math.min(1, progress), 0) * 100) }}% completed
        </ToastDescription>
    </ToastRoot>
</template>