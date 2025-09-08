<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '~/components/Button.vue'
import TextBox from '~/components/TextBox.vue'

const userInput = ref('')
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const loading = ref(false)
const supported = ref(false)
const availabilityStatus = ref<string>('')

const systemPrompt = ref(
    "You are a helpful assistant that provides clear and concise answers. Be polite, informative, and concise. Ask clarifying questions if necessary."
)
const { accepted } = useAIPolicyStatus()

let session: LanguageModel.Session | null = null

function detectBrowser(): 'edge' | 'chrome' | 'other' {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('edg/')) return 'edge'
    if (ua.includes('chrome/')) return 'chrome'
    return 'other'
}

onMounted(async () => {
    if (!('LanguageModel' in self)) {
        supported.value = false
        availabilityStatus.value =
            'Your browser does not support the Prompt API. Please use Chrome 138+ or Edge 138+.';
        return;
    }

    supported.value = true;
    availabilityStatus.value = await LanguageModel.availability();

    if (availabilityStatus.value === 'unavailable') {
        const browser = detectBrowser();
        if (browser === 'edge') {
            availabilityStatus.value =
                'Prompt API is available in Microsoft Edge 138+, but it must be manually enabled in edge://flags.';
        } else {
            availabilityStatus.value = 'Prompt API is currently unavailable in this browser.';
        }
    }
});

async function sendMessage() {
    if (!accepted.value) {
        messages.value.push({
            role: 'assistant',
            content: 'You must accept the AI Policy to use this tool.',
        });
        return;
    }

    if (!supported.value || availabilityStatus.value === 'unavailable') {
        messages.value.push({
            role: 'assistant',
            content: 'Prompt API not available in your environment.',
        });
        return;
    }

    if (!userInput.value.trim()) return;

    messages.value.push({ role: 'user', content: userInput.value });
    loading.value = true;

    // Push an empty message object that is reactive
    messages.value.push(reactive({ role: 'assistant', content: '' }));

    // Get the reference to the last message, which is now reactive
    const assistantMessage = messages.value[messages.value.length - 1];

    loading.value = true;

    try {
        session = session || (await LanguageModel.create({ prompt: systemPrompt.value || undefined }));

        const stream = await session.promptStreaming(userInput.value);
        userInput.value = '';
        for await (const chunk of stream) {
            // Vue will detect this change and re-render only the part of the component that uses assistantMessage.content
            assistantMessage.content += chunk;
            triggerRef(messages)
        }

    } catch (err: any) {
        messages.value.push({ role: 'assistant', content: `Error: ${err.message || err}` });
    } finally {
        loading.value = false;
    }
}

function clearChat() {
    messages.value = [];
    session = null;
}
</script>

<template>
    <Feature category="AI" tool="Prompt API" class="flex justify-center">
        <div class="w-full md:w-[70vw] flex flex-col gap-6">
            <div v-if="availabilityStatus !== 'available'" class="w-full p-3 font-bold rounded-md text-sm">
                {{ availabilityStatus }}
            </div>

            <div class="text-center">
                By using this tool, you agree to our <OurLink href="/ai/policy" target="_blank">AI Policy</OurLink>.
            </div>

            <details class="flex flex-col gap-2 w-full">
                <summary>System Prompt</summary>
                <TextBox v-model="systemPrompt" placeholder="Optional system prompt" :readonly="messages.length > 0"
                    style="height: unset;" class="w-full" multiline />
            </details>
            <div class="flex flex-col gap-2">
                <div v-for="(msg, idx) in messages" :key="idx"
                    :class="msg.role === 'user' ? 'text-right' : 'text-left'">
                    <span :class="msg.role === 'user' ? 'font-bold' : 'italic'">
                        {{ msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Assistant' : 'System' }}:
                    </span>
                    <pre class="font-[system-ui] select-text text-wrap">{{ msg.content }}</pre>
                </div>
            </div>

            <TextBox v-model="userInput" placeholder="Type a message..." class="w-full min-h-[50px]" multiline />

            <div class="flex gap-2 w-full lg:w-3/4">
                <ClientOnly>
                    <Button v-if="accepted" :disabled="loading || !supported || availabilityStatus === 'unavailable'"
                        @click="sendMessage">
                        {{ loading ? 'Sending...' : 'Send' }}
                    </Button>
                    <template v-else>
                        <AiPolicyDialog>
                            <template #trigger>
                                <DialogTrigger as-child>
                                    <Button class="px-4 py-2"
                                        :disabled="loading || !supported || availabilityStatus === 'unavailable'">
                                        Send
                                    </Button>
                                </DialogTrigger>
                            </template>
                        </AiPolicyDialog>
                    </template>
                    <template #fallback>
                        <Button :disabled="loading || !supported || availabilityStatus === 'unavailable'">
                            {{ loading ? 'Sending...' : 'Send' }}
                        </Button>
                    </template>
                </ClientOnly>
                <Button variant="destructive" @click="clearChat">Clear Chat</Button>
            </div>
        </div>

        <template #summary>
            AI-powered streaming chat using the Prompt API. System prompts and conversation context are supported.
        </template>
        <template #details>
            <p>
                Messages appear in real-time as the AI responds. You can provide a system prompt to guide behavior and
                clear the chat at any time.
            </p>
        </template>
    </Feature>
</template>
