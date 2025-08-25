<script setup lang="ts">
    import LeftArrow from '@fluentui/svg-icons/icons/arrow_left_24_filled.svg?raw'
    const props = defineProps<{ class?: string, category: 'dev' | 'math' | 'snippets' | 'none', tool: string, noDetails?: boolean, limitScreen?: boolean }>()
    const ToolsMap: { [key in typeof props.category]: string } = {
        none: 'SimplyTools',
        dev: 'SimplyDevTools',
        math: 'SimplyMathTools',
        snippets: 'SimplySnippets (Alpha)'
    }
    useHead({ title: `${ToolsMap[props.category]} - ${props.tool}` })
</script>
<template>
    <div class="grid min-h-screen data-[limit-screen='true']:h-screen" :data-limit-screen=limitScreen
        style="grid-template-rows: 0px auto minmax(0, 1fr) auto;">
        <div class="sticky top-0 left-0 flex">
            <Control
                class="p-button-icon rounded-control m-4 mt-[max(1rem,_var(--app-titlebar-height,_0px))] ml-[max(1rem,_var(--app-titlebar-height,_0px))] h-max">
                <OurLink class="manual" tabindex="0" href="/">
                    <Icon :icon=LeftArrow alt="" />
                </OurLink>
            </Control>
        </div>
        <div class="flex flex-col gap-16">
            <h1 class="text-center pt-16">{{ ToolsMap[props.category] }} - {{ tool }}</h1>
            <noscript class="text-danger text-center">JavaScript is required for many of our tools. Without them, they
                are
                unlikely to work correctly.</noscript>
        </div>
        <div v-if="!limitScreen" class="mt-16 mb-8 w-full">
            <div :class>
                <slot></slot>
            </div>
        </div>
        <div v-else class="mt-16 mb-8 w-full" :class>
            <slot></slot>
        </div>
        <div class="app-hidden">
            <details v-if="!noDetails" class="text-center">
                <summary><span class="italic">Extra Info: <slot name="summary">We are working on this tool. 🔨</slot>
                        </span></summary>
                <div class="flex justify-center mt-2">
                    <div class="p-2 border control-border-control bg-card rounded-2 text-left max-w-max">
                        <slot name="details">
                            That means unfortunately, I have not written the details yet. 😅
                        </slot>
                        <p class="italic text-center mt-4">SimplyTools are tools run locally in your browser. Easily
                            accessible from all
                            your devices
                            with
                            internet connections.<br />Whatever data you input here stays within your device. No ads and
                            none of your data are being sent out to the internet.</p>
                    </div>
                </div>
            </details>
            <Footer class="mt-1!" />
        </div>
    </div>
</template>