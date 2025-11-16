<script setup lang="ts">
    const model = defineModel<number | undefined>()
    const nbb = useTemplateRef('nbb')
    const props = defineProps<{ 
        placeholder: string, 
        mode: NumberInputModes, 
        min?: number, 
        max?: number 
    }>()
    defineExpose({ nbb })
</script>
<template>
    <NumberBoxBase ref="nbb" :placeholder :mode :model-value="model?.toString() ?? ''" :min="min?.toString()" :max="max?.toString()" @update:model-value="x => {
        let num = Number.parseFloat(x ?? '')
        if (Number.isNaN(num)) {
            return
        }
        if (props.min !== undefined && num < props.min) {
            num = props.min
        }
        if (props.max !== undefined && num > props.max) {
            num = props.max
        }
        model = num
    }" />
</template>