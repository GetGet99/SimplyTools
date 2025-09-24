<script setup lang="ts">
import LeftArrow from '@fluentui/svg-icons/icons/arrow_left_24_filled.svg?raw'
import { AICategory } from '~/utils/pages/ai';
const props = defineProps<{ class?: string, noDetails?: boolean, limitScreen?: 'xl' | 'all', app?: 'do-not-center' }>()
const tool = usePageInfo()
useHead({ title: `${tool.value.appName} - ${tool.value.toolName}` })
</script>
<template>
    <Grid class="feature-root min-h-screen xl:data-[limit-screen='xl']:h-screen data-[limit-screen='all']:h-screen" :data-limit-screen=limitScreen>
        <TitleBar />
        <Flex column class="app:hidden" :class="tool.isApp ? 'gap-8' : 'gap-16'">
            <h1 class="text-center pt-16">{{ tool.appName }} - {{ tool.toolName }}</h1>
            <noscript class="text-danger text-center">JavaScript is required for many of our tools. Without them, they
                are
                unlikely to work correctly.</noscript>
        </Flex>
        <div class="mt-16 app:mt-8 not-app:mb-8 w-full"
            :class="[limitScreen ? $props.class : '', app !== 'do-not-center' ? 'app:flex app:flex-col app:justify-center' : '']">
            <div v-if="tool.category === AICategory" class="text-center mb-8">
                <span class="app:hidden">Note: This tool is powered by browsers' built-in AI.<br /></span>
                <span class="hidden app:inline">Note: This tool is powered by WebView2 browser's built-in
                    AI.<br /></span>
                As with many AI tools, mistakes and hallucinations can happen.<br />
                By using this tool, you agree to our <OurLink href="/ai/policy" target="_blank">AI Policy</OurLink> and
                comply with your browsers' AI terms.
            </div>
            <div v-if="!limitScreen" :class>
                <slot></slot>
            </div>
            <slot v-else></slot>
        </div>
        <div class="app:hidden">
            <details v-if="!noDetails" class="text-center">
                <summary><span class="italic">Extra Info: <slot name="summary">We are working on this tool. 🔨</slot>
                    </span></summary>
                <Flex class="justify-center mt-2">
                    <div class="p-2 border control-border-control bg-card rounded-2 text-left max-w-max">
                        <slot name="details">
                            That means unfortunately, I have not written the details yet. 😅
                        </slot>
                        <p class="italic text-center mt-4">SimplyTools are tools run locally in your browser. Easily
                            accessible from all
                            your devices
                            with
                            internet connections.<br /><template v-if="tool.category !== AICategory">
                                Whatever data you input here stays within your device. No ads and
                                none of your data are being sent out to the internet.
                            </template><template v-else>
                                We do not collect, transmit, or store any of the content you input into or the output
                                you receive from these AI APIs. All processing of your data for these features happens
                                with browsers' built-in APIs, which may have their own data collection practices. Please
                                refer to
                                our <OurLink href="/ai/policy" target="_blank">AI Policy</OurLink> and your browser's
                                privacy policy for more details.
                            </template></p>
                    </div>
                </Flex>
            </details>
            <Footer class="mt-1!" />
        </div>
    </Grid>
</template>
<style>
@reference '../app.css';

.feature-root {
    @variant app {
        grid-template-rows: 0px minmax(0, 1fr);
    }

    @variant not-app {
        grid-template-rows: 0px auto minmax(0, 1fr) auto;
    }
}
</style>