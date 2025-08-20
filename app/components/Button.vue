<script setup lang="ts">
    
    const props = defineProps<{ varient?: Varients, bg?: BackgroundVarients, border?: BorderVarients }>()
    const _border = border
</script>
<template>
    <button type="button" :class="`${background(varient ?? 'control')} ${_border(varient ?? 'control')} transition-colors duration-200`" v-bind="$attrs">
        <slot />
    </button>
</template>