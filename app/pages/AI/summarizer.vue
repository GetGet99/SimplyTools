<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { keyof } from 'zod'
import Button from '~/components/Button.vue'
import TextBox from '~/components/TextBox.vue'
import type { } from '~/types/summarizer'

const input = ref('')
const summary = ref('')
const loading = ref(false)
const supported = ref(false)
const availabilityStatus = ref<string>('')
const warningMessage = ref<string>('')

const SummaryTypes = ['tldr', 'teaser', 'headline', 'key-points'] as const
const SummaryFormats = ['plain-text', 'markdown'] as const
const SummaryLengths = ['short', 'medium', 'long'] as const
type SummaryType = typeof SummaryTypes[number];
type SummaryFormat = typeof SummaryFormats[number];
type SummaryLength = typeof SummaryLengths[number];
const type = ref<SummaryType>('key-points')
const format = ref<SummaryFormat>('plain-text')
const length = ref<SummaryLength>('short')

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

        <!-- Input Text -->
        <TextBox v-model="input" placeholder="Enter text to summarize" class="w-full lg:w-3/4 min-h-[150px]"
            multiline />

        <!-- Option Controls -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 w-full lg:w-3/4">
            <div class="flex flex-col md:flex-row md:items-end gap-4">
                <!-- Type -->
                <div class="w-30">
                    <label class="block text-sm font-medium mb-2">Summary Type</label>
                    <ComboBox v-slot="{ option }" :options="SummaryTypes" v-model="type" class="w-full">
                        <template v-if="option === 'key-points'">Key Points</template>
                        <span class="capitalize" v-else>{{ option }}</span>
                    </ComboBox>
                </div>

                <!-- Format -->
                <div class="w-30">
                    <label class="block text-sm font-medium mb-2">Output Format</label>
                    <ComboBox v-slot="{ option }" :options="SummaryFormats" v-model="format" class="w-full">
                        <template v-if="option === 'plain-text'">Plain Text</template>
                        <span class="capitalize" v-else>{{ option }}</span>
                    </ComboBox>
                </div>

                <!-- Length -->
                <div class="w-30">
                    <label class="block text-sm font-medium mb-2">Length</label>
                    <ComboBox v-slot="{ option }" :options="SummaryLengths" v-model="length" class="w-full">
                        <span class="capitalize">{{ option }}</span>
                    </ComboBox>
                </div>
            </div>
            <!-- Generate Button -->
            <ClientOnly>
                <Button v-if="agreementAccepted"
                    :disabled="loading || !supported || availabilityStatus === 'unavailable'" @click="generateSummary">
                    {{ loading ? 'Generating...' : 'Generate Summary' }}
                </Button>
                <template v-else>
                    <AiPolicyDialog>
                        <template #trigger>
                            <DialogTrigger as-child>
                                <Button :disabled="loading || !supported || availabilityStatus === 'unavailable'">
                                    Generate Summary
                                </Button>
                            </DialogTrigger>
                        </template>
                    </AiPolicyDialog>
                </template>
                <template #fallback>
                    <Button disabled>
                        Loading...
                    </Button>
                </template>
            </ClientOnly>
        </div>



        <!-- Output -->
        <TextBox :model-value="summary" placeholder="Summary will appear here" class="w-full lg:w-3/4 min-h-[100px]"
            readonly multiline />

        <template #summary>
            AI-powered summarization using Browser’s Summarizer API, with configurable type, format, and length.
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
