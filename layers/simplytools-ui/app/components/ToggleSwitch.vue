<template>
    <div v-if="$slots.default" class="flex gap-2 items-center" :class="labelLocation === 'right' ? 'flex-row' : 'flex-row-reverse'">
        <SwitchRoot :id v-model="model" class="toggle-switch">
            <SwitchThumb class="toggle-switch-thumb" />
        </SwitchRoot>
        <label :for="id">
            <slot />
        </label>
    </div>
    <SwitchRoot v-else :id v-model="model" class="toggle-switch">
        <SwitchThumb class="toggle-switch-thumb" />
    </SwitchRoot>
</template>
<script setup lang="ts">
defineProps<{ labelLocation?: 'left' | 'right' }>()
const model = defineModel<boolean>()
const id = useId()
</script>
<style scoped>
@reference '~~/layers/simplytools-ui/app/app.css';

.toggle-switch {
    @apply w-10 h-5 border border-control-strong;
    @apply shadow-sm relative rounded-full;
    @apply focus-within:outline-none focus-within:shadow-[0_0_0_1px];
    @apply bg-transparent transition-[background];

    @variant data-[state=checked] {
        @apply utils-bg-control-accent bg-accent-primary utils-border-control-accent;
    }
}

.toggle-switch-thumb {
    @apply w-3 h-3 rounded-full bg-white text-xs flex items-center justify-center shadow-xl transition-transform -translate-y-0.5 will-change-transform;
    @apply bg-txt-fill-color-secondary;
    @apply -translate-x-2;

    @variant data-[state=checked] {
        @apply translate-x-3 bg-foreground-on-accent-primary;
    }
}
</style>