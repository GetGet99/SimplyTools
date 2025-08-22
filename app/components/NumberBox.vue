<script setup lang="ts">
    const model = defineModel<number | undefined>()
    const nbb = useTemplateRef('nbb')
    defineProps<{ placeholder: string, mode: NumberInputModes }>()
    defineExpose({ nbb })
</script>
<template>
    <NumberBoxBase ref="nbb" :placeholder :mode :model-value="model?.toString() ?? ''" @update:model-value="x => {
        let num = Number.parseFloat(x ?? '')
        if (Number.isNaN(num)) {
            return
        }
        model = num
    }" />
</template>