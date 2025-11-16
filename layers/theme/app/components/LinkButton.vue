<script setup lang="ts">
defineProps<{ variant?: Variants, icon?: boolean | 'left' | 'right', iconNoFlex?: boolean, href: string }>()
const button = useTemplateRef('link')
defineExpose({ button })
</script>
<template>
    <OurLink ref="link" class="manual control" :href :class="[icon === true ? `control-icon` : (icon ? `control-icon-${icon[0]}` : undefined), variant ? `control-${variant}` : 'control-regular', icon && !iconNoFlex ? 'flex gap-1' : '']">
        <slot />
    </OurLink>
</template>