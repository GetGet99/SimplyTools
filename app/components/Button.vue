<script setup lang="ts">
export type ButtonProps = { variant?: Variants, icon?: boolean | 'left' | 'right', iconNoFlex?: boolean }
defineProps<ButtonProps>()
const button = useTemplateRef('button')
defineExpose({ button })
</script>
<template>
    <button ref="button" type="button" class="control" :class="[icon === true ? `control-icon` : (icon ? `control-icon-${icon[0]}` : undefined), variant ? `control-${variant}` : 'control-regular', icon && !iconNoFlex ? 'flex gap-1' : '']">
        <slot />
    </button>
</template>