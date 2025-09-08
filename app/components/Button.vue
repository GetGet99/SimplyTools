<script setup lang="ts">
    
    const props = defineProps<{ variant?: Varients, bg?: BackgroundVarients, border?: BorderVarients }>()
    const _border = border
    const button = useTemplateRef('button')
    defineExpose({ button })
</script>
<template>
    <button ref="button" type="button" :class="`${background(variant ?? 'control')} ${_border(variant ?? 'control')} transition-colors duration-200`">
        <slot />
    </button>
</template>