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
    const regex = /^[0-9a-fA-F]{0,6}$/
</script>
<template>
    <TextBox :model-value="hexRaw ?? color?.HexCode ?? ''" :validate="x => regex.test(x)" @update:model-value="hexInputUpdate" />
</template>