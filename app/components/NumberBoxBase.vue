<script setup lang="ts">
    const props = defineProps<{ placeholder: string, mode: AnyNumberInputModes, min?: string, max?: string }>()
    const model = defineModel<string | undefined>()
    const tb = useTemplateRef('tb')
    watch(() => props.mode, () => {
        if (props.mode == 'integer') {
            let newVal = model.value ?? ''
            let idx = newVal.indexOf('.')
            if (idx >= 0) {
                newVal = newVal.slice(0, idx)
            }
            model.value = newVal
        }
    }, { immediate: false })
    defineExpose({ tb })
</script>
<template>
    <TextBox ref="tb" :placeholder :model-value="model" :validate="x => {
        if (x === '') {
            return true
        }
        if (x === '-') {
            if (NumberNegativeSignBypass[mode]) {
                return true
            }
        }
        return NumberInputRegexes[mode].test(x)
    }" @update:model-value="x => {
        model = x
    }" role="spinbutton" :paste-preprocessor=NumberNormalizeInput[mode] :aria-valuenow="model" :aria-valuemin=min :aria-valuemax=max inputmode="decimal"
        :pattern=NumberInputRegexes[mode].source />
</template>