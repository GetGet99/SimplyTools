<script setup lang="ts">
    const model = defineModel<bigint | undefined>()
    const nbb = useTemplateRef('nbb')
    defineProps<{ placeholder: string, mode: IntegerInputModes | BigIntInputModes }>()
    defineExpose({ nbb })
</script>
<template>
    <NumberBoxBase ref="nbb" :placeholder :mode :model-value="model?.toString() ?? ''" @update:model-value="x => {
        if (!x) {
            return
        }
        try {
            if (mode === 'binary')
                x = '0b' + x
            if (mode === 'hex')
                x = '0x' + x
            if (mode === 'octal')
                x = '0o' + x
            model = BigInt(x)
        } catch {

        }
    }" />
</template>