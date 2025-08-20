<script setup lang="ts">
    const props = defineProps<{ placeholder: string, mode: 'real' | 'integer' }>()
    const model = defineModel<number | undefined>()
    const intRegex = /^-?[0-9]+$/
    const floatRegex = /^-?([0-9]*[.])?[0-9]*$/
    const t1 = useTemplateRef('tb123')
    const revertSafeState = ref('')
    function getText() {
        if (model.value === undefined) {
            if (revertSafeState.value === '' || revertSafeState.value === '-') {
                return revertSafeState.value
            } else {
                return ''
            }
        }
        if (Number.parseFloat(revertSafeState.value) == model.value)
            return revertSafeState.value
        return model.value?.toString() ?? ''
    }
    watch(() => props.mode, () => {
        if (props.mode == 'integer') {
            const newVal = Math.trunc(model.value ?? 0)
            // if (newVal != model.value) {
            //     rever
            // }
            model.value = newVal
        }
    }, { immediate: false })
    const tbRef = ref<HTMLInputElement | null>()
    watch(() => t1.value, () => {
        tbRef.value = (t1.value as any as HTMLInputElement)!
    })
    defineExpose(tbRef)
</script>
<template>
    <TextBox ref="tb123" :placeholder :model-value="getText()" @update:model-value="x => {
        if (x == '') {
            revertSafeState = ''
            model = undefined
            return
        }
        if (x == '-') {
            revertSafeState = '-'
            model = undefined
            return
        }
        const activeRegex = mode === 'integer' ? intRegex : floatRegex
        if (!activeRegex.test(x ?? '')) {
            //@ts-ignore
            (t1 as HTMLInputElement).value = getText()
            return
        }
        const num = Number.parseFloat(x ?? '')
        if (!Number.isNaN(num)) {
            revertSafeState = x ?? ''
            model = num
        } else {
            model = num
        }
    }" role="spinbutton" :aria-valuenow="model" aria-valuemin="0" aria-valuemax="100" inputmode="decimal"
        pattern="-?([0-9]*[.])?[0-9]*" v-bind="$attrs" />
</template>