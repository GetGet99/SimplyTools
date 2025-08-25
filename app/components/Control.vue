<script setup lang="ts">
    const props = defineProps<{ varient?: Varients, bg?: BackgroundVarients, border?: BorderVarients }>()
    const _border = border
</script>
<template>
    <primitive as-child :class="`control ${background(varient ?? 'control')} ${_border(varient ?? 'control')} transition-colors duration-200`">
        <slot></slot>
    </primitive>
</template>