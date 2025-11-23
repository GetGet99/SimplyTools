<script setup lang="ts">
defineProps<{ class?: string, style?: any, noDetails?: boolean, limitScreen?: 'xl' | 'all', app?: 'do-not-center', detailsVisible?: 'always' | 'hidden' }>()
const tool = usePageInfo()
useHead({ title: `${tool.value.appName} - ${tool.value.toolName}` })
</script>
<template>
    <Grid class="feature-root min-h-full xl:data-[limit-screen='xl']:h-full data-[limit-screen='all']:h-full"
        :data-limit-screen=limitScreen>
        <Flex column class="app:hidden gap-4">
            <h1 class="pt-4 -mb-1 text-center app:hidden flex gap-0.5 justify-center items-center">
                <SimplyToolsIcon alt="" class="w-15 h-15" />
                <span style="line-height: 1em;" class="-translate-y-0.5">{{ tool.appName }} - {{ tool.toolName }}</span>
            </h1>
            <noscript class="text-danger text-center">JavaScript is required for many of our tools. Without them,
                they
                are
                unlikely to work correctly.</noscript>
        </Flex>
        <div class="mt-4 app:mt-0 not-app:mb-8 w-full"
            :class="[limitScreen ? $props.class : '', app !== 'do-not-center' ? 'app:flex app:flex-col app:justify-center' : '']" :style="limitScreen ? $props.style : ''">
            <div v-if="tool.category === AICategory" class="text-center mb-8">
                <span class="app:hidden">Note: This tool is powered by browsers' built-in AI.<br /></span>
                <span class="hidden app:inline">Note: This tool is powered by WebView2 browser's built-in
                    AI.<br /></span>
                As with many AI tools, mistakes and hallucinations can happen.<br />
                By using this tool, you agree to our <OurLink href="/ai/policy" target="_blank">AI Policy</OurLink>
                and
                comply with your browsers' AI terms.
            </div>
            <div v-if="!limitScreen" :class :style>
                <slot></slot>
            </div>
            <slot v-else></slot>
        </div>
        <div :class="detailsVisible !== 'hidden' ? (detailsVisible === 'always' ? '' : 'app:hidden') : 'hidden'">
            <details v-if="!noDetails" class="text-center app:mb-2">
                <summary><span class="italic">Extra Info: <slot name="summary">We are working on this tool. 🔨
                        </slot>
                    </span></summary>
                <Flex class="justify-center mt-2">
                    <div class="p-2 border control-border-control bg-card rounded-2 text-left max-w-max">
                        <slot name="details">
                            That means unfortunately, I have not written the details yet. 😅
                        </slot>
                        <p class="italic text-center mt-4 app:hidden">SimplyTools are tools run locally in your browser. Easily
                            accessible from all
                            your devices
                            with
                            internet connections.<br /><template v-if="tool.category !== AICategory">
                                Whatever data you input here stays within your device. No ads and
                                none of your data are being sent out to the internet.
                            </template><template v-else>
                                We do not collect, transmit, or store any of the content you input into or the
                                output
                                you receive from these AI APIs. All processing of your data for these features
                                happens
                                with browsers' built-in APIs, which may have their own data collection practices.
                                Please
                                refer to
                                our <OurLink href="/ai/policy" target="_blank">AI Policy</OurLink> and your
                                browser's
                                privacy policy for more details.
                            </template></p>
                    </div>
                </Flex>
            </details>
            <Footer class="mt-1! app:not-app-browser:hidden" />
        </div>
    </Grid>
</template>
<style>
@reference '~~/layers/simplytools-ui/app/app.css';

.feature-root {
    @variant app {
        grid-template-rows: minmax(0, 1fr);
    }

    @variant not-app {
        grid-template-rows: auto minmax(0, 1fr) auto;
    }
}
</style>