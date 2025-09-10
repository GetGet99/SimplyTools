<script setup lang="ts">
    const hexRaw = ref<string | undefined>(undefined)
    const color = defineModel<string>()
    function hexInputUpdate(raw: string | undefined) {
        if (finalValueRegex.test(raw ?? '')) {
            color.value = raw
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
    const regex = /^#?[0-9a-fA-F]{0,8}$/
    const finalValueRegex = /^#?([\da-fA-F]{3})([\da-fA-F]{3})?([\da-fA-F]{2})?$/
</script>
<template>
    <TextBox :model-value="hexRaw ?? color ?? ''" :validate="x => regex.test(x)" @update:model-value="hexInputUpdate" />
</template>