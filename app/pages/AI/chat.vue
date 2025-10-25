<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '~/components/Button.vue'
import TextBox from '~/components/TextBox.vue'
import type { } from '~/types/prompt.d.ts'
import { AICategory } from '~/utils/pages/ai'
usePageInfo(AICategory.pages.find(x => x.path === 'chat'))
const userInput = ref('')
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const loading = ref(false)
const supported = ref(false)
const availabilityStatus = ref<string>('')

const systemPrompt = ref(
    "You are a helpful assistant that provides clear and concise answers. Be polite, informative, and concise. Ask clarifying questions if necessary."
)
const { accepted } = await useAIPolicyStatusAsync()

let session: LanguageModel | null = null

function detectBrowser(): 'app' | 'edge' | 'chrome' | 'other' {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('simplytools/')) return 'app'
    if (ua.includes('edg/')) return 'edge'
    if (ua.includes('chrome/')) return 'chrome'
    return 'other'
}

onMounted(async () => {
    if (!('LanguageModel' in self)) {
        supported.value = false
        const browser = detectBrowser();
        if (browser === 'app') {
            availabilityStatus.value = 'Prompt API is not currently available in the Simply Tools app. Please use Chrome 138+ or Edge 138+.';
        } else if (browser === 'edge') {
            availabilityStatus.value =
                'Prompt API is available in Microsoft Edge 138+, but it must be manually enabled in edge://flags.';
        } else {
            availabilityStatus.value = 'Your browser does not support the Prompt API. Please use Chrome 138+ or Edge 138+.';
        }
        return;
    }

    supported.value = true;
    availabilityStatus.value = await LanguageModel.availability();

    if (availabilityStatus.value === 'unavailable') {
        const browser = detectBrowser();
        if (browser === 'app') {
            availabilityStatus.value = 'Prompt API is not currently available in the Simply Tools app. Please use Chrome 138+ or Edge 138+.';
        } else {
            availabilityStatus.value = 'Prompt API is not available in your browser.';
        }
    }
});
const toasts = useToasts()
async function sendMessage() {
    if (!accepted.value) {
        messages.value.push({
            role: 'assistant',
            content: 'You must accept the AI Policy to use this tool.',
        });
        return;
    }
    // only unavailable has space in it because we post process the message
    if (!supported.value || availabilityStatus.value.includes(' ')) {
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
    const assistantMessage = messages.value[messages.value.length - 1]!;

    loading.value = true;

    const input = userInput.value
    userInput.value = ''

    try {
        if (!session) {
            assistantMessage.content = 'Initializing chat... please be patient'
            let progressRef: undefined | Ref<number> = undefined
            session = (await LanguageModel.create({
                initialPrompts: [
                    { role: 'system', content: systemPrompt.value }
                ],
                monitor(m: EventTarget) {
                    m.addEventListener('downloadprogress', <T extends { loaded: number } & EventTarget>(e: T) => {
                        if (progressRef === undefined) {
                            progressRef = ref(e.loaded)
                            toasts.pushProgress('Downloading Model', progressRef)
                        }
                        progressRef.value = e.loaded
                    });
                }
            }));
            if (progressRef !== undefined) {
                (progressRef as Ref<number>).value = 1
            }
            assistantMessage.content = ''
        }
        const stream = session.promptStreaming(input);
        //@ts-ignore
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
    <Feature category="AI" tool="Chat" class="flex justify-center">
        <Flex column class="w-full md:w-[70vw] gap-6">
            <div v-if="availabilityStatus !== 'available' && availabilityStatus !== 'downloadable'"
                class="w-full p-3 font-bold rounded-md text-sm">
                {{ availabilityStatus }}
            </div>

            <details class="flex flex-col gap-2 w-full">
                <summary>System Prompt</summary>
                <TextBox v-model="systemPrompt" placeholder="Optional system prompt" :readonly="messages.length > 0"
                    style="height: unset;" class="w-full" multiline />
            </details>
            <Flex column class="gap-2">
                <Flex column v-for="(msg, idx) in messages" :key="idx"
                    :class="msg.role === 'user' ? 'items-end' : 'items-start'" class="gap-1">
                    <span :class="msg.role === 'user' ? 'font-bold' : 'italic'">
                        {{ msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Assistant' : 'System' }}:
                    </span>
                    <pre
                        class="p-2 bg-control-primary border-border-control-primary rounded-1 w-fit font-[system-ui] select-text text-wrap">{{ msg.content }}</pre>
                </Flex>
            </Flex>

            <TextBox v-model="userInput" placeholder="Type a message..." class="w-full min-h-[50px]" multiline />

            <Flex class="gap-2 w-full lg:w-3/4">
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
                <Button @click="clearChat">Clear Chat</Button>
            </Flex>
        </Flex>

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
