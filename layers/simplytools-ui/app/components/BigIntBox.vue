<script setup lang="ts">
type SupportedBaseBigInt = 16n | 10n | 8n | 2n
type SupportedBase = 16 | 10 | 8 | 2
const model = defineModel<bigint | undefined>()
const nbb = useTemplateRef('nbb')
const props = defineProps<{ placeholder: string, mode: IntegerInputModes | BigIntInputModes | SupportedBaseBigInt | SupportedBase }>()
defineExpose({ nbb })
const modePostProcessd = computed<AnyNumberInputModes>(() => {
    const mode = props.mode
    if (mode === 16n || mode === 16) {
        return 'hex'
    }
    if (mode === 10n || mode === 10) {
        return 'integer'
    }
    if (mode === 8n || mode === 8) {
        return 'octal'
    }
    if (mode === 2n || mode === 2) {
        return 'binary'
    }
    return mode
})
const base = computed<number>(() => {
    const mode = props.mode
    if (mode === 'hex' || mode === 16n || mode === 16) {
        return 16
    }
    if (mode === 'octal' || mode === 8n || mode === 8) {
        return 8
    }
    if (mode === 'binary' || mode === 2n || mode === 2) {
        return 2
    }
    return 10
})
function addPrefix(x: string, prefix: string): string {
    if (x[0] === '-') {
        return '-' + prefix + x.slice(1)
    } else {
        return prefix + x
    }
}
</script>
<template>
    <NumberBoxBase ref="nbb" :placeholder :mode=modePostProcessd :model-value="model?.toString(base) ?? ''"
        @update:model-value="x => {
            if (!x) {
                return
            }
            try {
                if (modePostProcessd === 'binary')
                    x = addPrefix(x, '0b')
                if (modePostProcessd === 'hex')
                    x = addPrefix(x, '0x')
                if (modePostProcessd === 'octal')
                    x = addPrefix(x, '0o')
                model = BigInt(x)
            } catch {

            }
        }" />
</template>