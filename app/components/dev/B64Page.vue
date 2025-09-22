<script setup lang="ts">
import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
import FileIcon from '@fluentui/svg-icons/icons/document_24_regular.svg?raw'
import SaveFileIcon from '@fluentui/svg-icons/icons/document_arrow_down_24_regular.svg?raw'
import PasteIcon from '@fluentui/svg-icons/icons/clipboard_paste_24_regular.svg?raw'
import { DevCategory } from '~/utils/pages/dev'
// const mode = ref<'atob' | 'btoa'>(route.params.mode === 'encoder' ? 'btoa' : 'atob')
const mode = defineModel<'atob' | 'btoa'>('mode')
const input = ref('')
function safeBToA(val: string) {
    try {
        return btoa(val)
    } catch (err) {
        return `Error: Cannot encode to Base 64 value ${err}`
    }
}

function safeAToB(val: string) {
    try {
        return atob(val)
    } catch (err) {
        return `Error: Invalid Base 64 value ${err}`
    }
}
const output = computed(() => (mode.value === 'atob' ? safeAToB : safeBToA)(input.value))
function copy() {
    navigator.clipboard.writeText(output.value)
}
function paste() {
    navigator.clipboard.readText().then(text => {
        input.value = text
    })
}
function fromFile() {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                input.value = e.target?.result as string
            }
            reader.readAsText(file)
        }
    }
    inputElement.click()
}
function toFile() {
    const blob = new Blob([output.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'encoded data.txt'
    a.click()
    URL.revokeObjectURL(url)
}
const w = window
</script>
<template>
    <Feature category="dev" tool="Base 64 Converter" class="flex flex-col gap-5" limit-screen="xl">
        <div class="flex flex-col items-center gap-5">
            <Button @click="mode = mode === 'atob' ? 'btoa' : 'atob'; w.location">Switch to Base 64 {{ mode !== 'atob' ? 'decoder' : 'encoder' }}</Button>
        </div>
        <div class="grow grid not-lg:grid-rows-2 lg:grid-cols-2 gap-15 mx-2 lg:mx-10">
            <div class="grid" style="grid-template-columns: minmax(0, 1fr) auto;">
                <TextBox v-model="input" :placeholder="mode === 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="peer focus:hover:bg-transparent rounded-r-none! border-r-0! h-full resize-none"
                    multiline />
                <div class="flex flex-col b64-textbox-controls overflow-hidden">
                    <Button class="b64-textbox-button bg-transparent" @click="paste">
                        <Icon :icon=PasteIcon alt="Paste" />
                    </Button>
                    <Button class="b64-textbox-button bg-transparent" @click="fromFile">
                        <Icon :icon=FileIcon alt="From file" />
                    </Button>
                </div>
            </div>

            <!-- <div class="flex items-center justify-center">
                <Button class="w-fit p-button-icon" @click="mode = mode === 'atob' ? 'btoa' : 'atob'"
                    :title="`Swap to ${mode === 'atob' ? 'Normal to Base64' : 'Base64 to Normal'} mode`">
                    <Icon :icon=ArrowSwap alt="" />
                </Button>
            </div> -->

            <div class="grid" style="grid-template-columns: minmax(0, 1fr) auto;">
                <TextBox :model-value="output" :placeholder="mode !== 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="peer focus:hover:bg-transparent rounded-r-none! border-r-0! h-full resize-none" multiline />
                <div class="flex flex-col b64-textbox-controls overflow-hidden">
                    <Button class="b64-textbox-button bg-transparent" @click="copy">
                        <Icon :icon=CopyIcon alt="Copy" />
                    </Button>
                    <Button class="b64-textbox-button bg-transparent" @click="toFile">
                        <Icon :icon=SaveFileIcon alt="Save file" />
                    </Button>
                </div>
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
<style lang="css">
@reference '~/app.css';

.b64-textbox-controls {
    @apply rounded-control rounded-l-none border bg-control-primary border-border-control-primary border-l-0 border-b-2 border-b-control-strong peer-focus:border-b-textbox-accent-highlight peer-focus:bg-transparent;
}

@layer components {
    .b64-textbox-button {
        @apply p-button-icon pt-1 border-none rounded-none;
    }
}
</style>