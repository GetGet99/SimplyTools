<script setup lang="ts">
    defineProps<{ varient?: Varients }>()
</script>
<template>
    <primitive as-child :class="`${background(varient ?? 'control')} ${border(varient ?? 'control')}`">
        <slot></slot>
    </primitive>
</template>