<script setup lang="ts">
import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
import ArrowSwap from '@fluentui/svg-icons/icons/arrow_swap_24_filled.svg?raw'
import { DevCategory } from '~/utils/pages/dev'
usePageInfo(DevCategory.pages.find(x => x.path === 'b64'))
const mode = ref<'atob' | 'btoa'>('btoa')
const input = ref('')
function safeBToA(val: string) {
    try {
        return btoa(val)
    } catch {
        return "Error: Cannot encode to Base 64 value"
    }
}

function safeAToB(val: string) {
    try {
        return atob(val)
    } catch {
        return "Error: Invalid Base 64 value"
    }
}
const output = computed(() => (mode.value === 'atob' ? safeAToB : safeBToA)(input.value))
function copy() {
    navigator.clipboard.writeText(output.value)
}
</script>
<template>
    <Feature category="dev" tool="Base 64 Converter" class="flex justify-center">
        <div class="flex flex-col lg:flex-row gap-15">
            <TextBox v-model="input" :placeholder="mode === 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                class="lg:w-[25vw] min-h-50" multiline />

            <div class="flex items-center justify-center">
                <Button class="w-fit p-button-icon" @click="mode = mode === 'atob' ? 'btoa' : 'atob'"
                    :title="`Swap to ${mode === 'atob' ? 'Normal to Base64' : 'Base64 to Normal'} mode`">
                    <Icon :icon=ArrowSwap alt="" />
                </Button>
            </div>

            <div class="lg:w-[25vw] flex">
                <TextBox :model-value="output" :placeholder="mode !== 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="peer grow rounded-r-none! border-r-0!" />
                <Button
                    class="p-button-icon pt-1! rounded-l-none! border border-border-control-primary border-l-0 border-b-2 border-b-control-strong peer-focus:border-b-textbox-accent-highlight peer-focus:bg-transparent"
                    @click="copy">
                    <Icon :icon=CopyIcon alt="Copy" />
                </Button>
            </div>
        </div>
        <template #summary>
            Encoding and decoding base64 without opening DevTools.
        </template>
        <template #details>
            <p>Easily convert base64 encoded string to and from text. This is a UI wrapper of <code>atob</code> and
                <code>btoa</code> JavaScript functions. No longer needed to open devtools to decode them!
            </p>
        </template>
    </Feature>
</template>