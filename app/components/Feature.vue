<script setup lang="ts">
    import LeftArrow from '@fluentui/svg-icons/icons/arrow_left_24_filled.svg?raw'
    const props = defineProps<{ class?: string, category: 'dev' | 'none', tool: string, noDetails?: boolean }>()

    useHead({ title: `${props.category === 'dev' ? 'SimplyDevTools' : 'SimplyTools'} - ${props.tool}` })
</script>
<template>
    <div class="grid min-h-screen" style="grid-template-rows: auto minmax(0, 1fr) auto;">
        <Control
            class="p-button-icon rounded-control absolute m-4 top-0 left-0 mt-[max(1rem,_var(--app-titlebar-height,_0px))]">
            <OurLink class="manual" tabindex="0" href="/">
                <Icon :icon=LeftArrow alt="" />
            </OurLink>
        </Control>
        <div class="flex flex-col gap-16">
            <h1 class="text-center pt-16">SimplyTools - {{ tool }}</h1>
            <noscript class="text-danger text-center">JavaScript is required for many of our tools. Without them, they
                are
                unlikely to work correctly.</noscript>
        </div>
        <div class="mt-16">
            <div :class>
                <slot></slot>
            </div>
        </div>
        <div class="app-hidden">
            <details v-if="!noDetails" class="text-center">
                <summary><span class="italic">Extra Info: <slot name="summary"></slot></span></summary>
                <slot name="details"></slot>
                <p>SimplyTools are tools run locally in your browser. Easily accessible from all your devices with
                    internet connections. Whatever data you input here stays within your device. No ads and data are
                    being
                    sent out to the internet.</p>
            </details>
            <Footer class="mt-1!" />
        </div>
    </div>
</template>