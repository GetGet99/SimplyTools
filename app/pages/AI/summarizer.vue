<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '~/components/Button.vue'
import TextBox from '~/components/TextBox.vue'
import type { } from '~/types/summarizer'

const input = ref('')
const summary = ref('')
const loading = ref(false)
const supported = ref(false)
const availabilityStatus = ref<string>('')
const warningMessage = ref<string>('')

const type = ref<'tldr' | 'teaser' | 'headline' | 'key-points'>('key-points')
const format = ref<'plain-text' | 'markdown'>('plain-text')
const length = ref<'short' | 'medium' | 'long'>('short')

const accepted = useAIPolicyStatus()

let summarizer: Summarizer | null = null

function detectBrowser(): 'edge' | 'chrome' | 'other' {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('edg/')) return 'edge'
    if (ua.includes('chrome/')) return 'chrome'
    return 'other'
}

onMounted(async () => {
    if (!('Summarizer' in self)) {
        supported.value = false
        warningMessage.value =
            'Your browser does not support the Summarizer API. Please use Chrome 138+ or Edge 138+.'
        return
    }

    supported.value = true
    availabilityStatus.value = await Summarizer.availability()

    if (availabilityStatus.value === 'unavailable') {
        const browser = detectBrowser()
        if (browser === 'edge') {
            warningMessage.value =
                'Summarizer API is available in Microsoft Edge 138+, but it must be manually enabled in edge://flags.'
        } else {
            warningMessage.value = 'Summarizer API is currently unavailable in this browser.'
        }
    }
})
const { accepted: agreementAccepted } = useAIPolicyStatus()
async function generateSummary() {

    if (!agreementAccepted.value) {
        summary.value = 'You must accept the AI Policy to use this tool.'
        return
    }

    if (!supported.value || availabilityStatus.value === 'unavailable') {
        summary.value = 'Summarizer not available in your environment.'
        return
    }

    loading.value = true
    try {
        summary.value = 'Generating summary...'
        summarizer = await Summarizer.create({
            type: type.value,
            format: format.value,
            length: length.value,
        })
        const result = await summarizer.summarize(input.value)
        requestAnimationFrame(() => {
            summary.value = result.output ?? result
        })
    } catch (err: any) {
        summary.value = `Error: ${err.message || err}`
    } finally {
        loading.value = false
    }
}
</script>


<template>
    <Feature category="AI" tool="Summarizer" class="flex flex-col items-center gap-6">
        <!-- Warning Message -->
        <div v-if="warningMessage" class="w-full lg:w-3/4 p-3 font-bold rounded-md text-sm">
            {{ warningMessage }}
        </div>

        <div class="text-center">
            By using this tool, you agree to our <OurLink href="/ai/policy" target="_blank">AI Policy</OurLink>.
        </div>
        <!-- Input Text -->
        <TextBox v-model="input" placeholder="Enter text to summarize" class="w-full lg:w-3/4 min-h-[150px]"
            multiline />

        <!-- Option Controls -->
        <div class="flex flex-col gap-4 w-full lg:w-3/4">
            <!-- Type -->
            <div>
                <label class="block text-sm font-medium mb-2">Summary Type</label>
                <div class="flex gap-2">
                    <Button v-for="opt in (['tldr', 'teaser', 'headline', 'key-points'] as (typeof type)[])" :key="opt"
                        class="px-3 py-1 capitalize" :variant="opt === type ? 'accent' : 'control'" @click="type = opt">
                        {{ opt }}
                    </Button>
                </div>
            </div>

            <!-- Format -->
            <div>
                <label class="block text-sm font-medium mb-2">Output Format</label>
                <div class="flex gap-2">
                    <Button v-for="opt in (['plain-text', 'markdown'] as (typeof format)[])" :key="opt"
                        class="px-3 py-1 capitalize" :variant="opt === format ? 'accent' : 'control'"
                        @click="format = opt">
                        {{ opt }}
                    </Button>
                </div>
            </div>

            <!-- Length -->
            <div>
                <label class="block text-sm font-medium mb-2">Length</label>
                <div class="flex gap-2">
                    <Button v-for="opt in (['short', 'medium', 'long'] as (typeof length)[])" :key="opt"
                        class="px-3 py-1 capitalize" :variant="opt === length ? 'accent' : 'control'"
                        @click="length = opt">
                        {{ opt }}
                    </Button>
                </div>
            </div>
        </div>

        <!-- Generate Button -->
        <ClientOnly>
            <Button v-if="agreementAccepted" class="px-4 py-2"
                :disabled="loading || !supported || availabilityStatus === 'unavailable'" @click="generateSummary">
                {{ loading ? 'Generating...' : 'Generate Summary' }}
            </Button>
            <template v-else>
                <AiPolicyDialog>
                    <template #trigger>
                        <DialogTrigger as-child>
                            <Button class="px-4 py-2"
                                :disabled="loading || !supported || availabilityStatus === 'unavailable'">
                                Generate Summary
                            </Button>
                        </DialogTrigger>
                    </template>
                </AiPolicyDialog>
            </template>
            <template #fallback>
                <Button class="px-4 py-2" disabled>
                    Loading...
                </Button>
            </template>
        </ClientOnly>


        <!-- Output -->
        <TextBox :model-value="summary" placeholder="Summary will appear here" class="w-full lg:w-3/4 min-h-[100px]"
            readonly multiline />

        <template #summary>
            AI-powered summarization using Chrome’s Summarizer API, with configurable type, format, and length.
        </template>
        <template #details>
            <p>
                Switch between <code>tl;dr</code>, <code>key-points</code>, <code>headline</code>, and more. You can
                also pick
                plain text or markdown output, and adjust summary length. Options map directly to the Summarizer API.
            </p>
        </template>
    </Feature>
</template>
