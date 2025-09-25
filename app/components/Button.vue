<script setup lang="ts">
defineProps<{ variant?: Variants, icon?: boolean | 'left' | 'right', iconNoFlex?: boolean }>()
const button = useTemplateRef('button')
defineExpose({ button })
</script>
<template>
    <button ref="button" type="button" class="control" :class="[icon === true ? `control-icon` : (icon ? `control-icon-${icon[0]}` : undefined), variant ? `control-${variant}` : 'control-regular', icon && !iconNoFlex ? 'flex gap-1' : '']">
        <slot />
    </button>
</template>