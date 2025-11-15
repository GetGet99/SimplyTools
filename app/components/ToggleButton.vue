<template>
    <Button :variant="modelValue ? 'accent' : 'regular'" @click="modelValue = !modelValue" v-bind="props">
        <slot />
    </Button>
</template>
<script setup lang="ts">
import type { ButtonProps } from './Button.vue'
const props = defineProps<Omit<ButtonProps, 'variant'>>()
const modelValue = defineModel<boolean>({ required: true })

</script>