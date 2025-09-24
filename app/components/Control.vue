<script setup lang="ts">
defineProps<{ varient?: Varients, icon?: boolean | 'left' | 'right' }>()
</script>
<template>
    <primitive as-child class="control"
        :class="[icon === true ? `control-icon` : (icon ? `control-icon-${icon[0]}` : undefined), varient ? `control-${varient}` : '']">
        <slot></slot>
    </primitive>
</template>