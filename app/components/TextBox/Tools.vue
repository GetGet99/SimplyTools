<script setup lang="ts">
defineProps<{
    toolbarPosition?: 'left' | 'right' | 'top' | 'bottom'
}>()
</script>
<template>
    <div class="style-textbox-group" :class="`style-textbox-group-${toolbarPosition ?? 'top'}`">
        <Flex :class="[
            toolbarPosition === 'left' || toolbarPosition === 'right' ? 'flex-col overflow-y-auto' : 'flex-row overflow-x-auto',
            toolbarPosition === 'right' || toolbarPosition === 'bottom' ? 'order-1' : undefined,
        ]">
            <slot name="tools" />
        </Flex>
        <Primitive as-child>
            <slot />
        </Primitive>
    </div>
</template>
<style>
@reference '~/app.css';

.style-textbox-group {
    @apply grid utils-style-textbox p-0 focus-within:utils-style-textbox-focus;
}

.style-textbox-group-left {
    grid-template-columns: auto minmax(0, 1fr);
}

.style-textbox-group-right {
    grid-template-columns: minmax(0, 1fr) auto;
}

.style-textbox-group-top {
    grid-template-rows: auto minmax(0, 1fr);
}

.style-textbox-group-bottom {
    grid-template-rows: minmax(0, 1fr) auto;
}
</style>