<script setup lang="ts">
    const hexRaw = ref<string | undefined>(undefined)
    const color = defineModel<HEX>()
    function hexInputUpdate(raw: string | undefined) {
        const newColor = HEX.fromString(raw ?? '')
        if (newColor !== undefined) {
            color.value = newColor
            hexRaw.value = undefined
        } else {
            hexRaw.value = raw ?? ''
        }
    }
    watch(() => color.value, () => {
        if (color.value !== undefined) {
            hexRaw.value = undefined
        }
    })
</script>
<template>
    <TextBox :model-value="hexRaw ?? color?.HexCode ?? ''" @update:model-value="hexInputUpdate" v-bind="$attrs" />
</template>