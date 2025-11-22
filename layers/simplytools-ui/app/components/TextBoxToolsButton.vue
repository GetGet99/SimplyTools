<template>
    <Button v-bind="$props" variant="ghost" class="textbox-group-button">
        <slot />
    </Button>
</template>
<script setup lang="ts">
import type { ButtonProps } from './Button.vue';

defineProps<Omit<ButtonProps, 'variant'>>()
</script>
<style>
@reference '~~/layers/simplytools-ui/app/app.css';

@layer components {
    .textbox-group-button {
        @apply p-button-icon pt-1 border-none rounded-none;
    }
}
</style>