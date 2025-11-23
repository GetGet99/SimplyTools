<template>
    <details :open="isOpen" @toggle="isOpen = ($event.target as HTMLDetailsElement | null)?.open ?? false">
        <slot />
    </details>
</template>
<script setup lang="ts">
const props = defineProps<{
    defaultOpen?: boolean
}>()
const isOpen = ref(!!props.defaultOpen)
</script>