<script setup lang="ts">
    import LeftArrow from '@fluentui/svg-icons/icons/arrow_left_24_filled.svg?raw'
    const props = defineProps<{ class?: string, tool: string }>()
    useHead({ title: `Simple Tools - ${props.tool}` })
</script>
<template>
    <div class="flex flex-col gap-16">
        <Control class="p-button-icon rounded-control absolute m-4 top-0 left-0 mt-[max(1rem,_var(--app-titlebar-height,_0px))]">
            <OurLink class="manual" tabindex="0" href="/">
                <Icon :icon=LeftArrow alt="" />
            </OurLink>
        </Control>
        <h1 class="text-center pt-16">Simple Tools - {{ tool }}</h1>
        <noscript class="text-danger text-center">JavaScript is required for many of our tools. Without them, they are unlikely to work correctly.</noscript>
        <div :class>
            <slot></slot>
        </div>
    </div>
</template>