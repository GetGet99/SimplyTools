<script setup lang="ts">
defineProps<{ variant?: Variants, icon?: boolean | 'left' | 'right' }>()
</script>
<template>
    <primitive as-child class="control"
        :class="[icon === true ? `control-icon` : (icon ? `control-icon-${icon[0]}` : undefined), variant ? `control-${variant}` : 'control-regular']">
        <slot></slot>
    </primitive>
</template>