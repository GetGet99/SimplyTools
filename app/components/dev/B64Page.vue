<script setup lang="ts">
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
        <Flex column class="items-center gap-5">
            <Button @click="mode = mode === 'atob' ? 'btoa' : 'atob'; w.location">Switch to Base 64 {{ mode !== 'atob' ?
                'decoder' : 'encoder' }}</Button>
        </Flex>
        <Grid :rows=2 :lg-rows=1 :lg-columns=2 class="grow gap-15 mx-2 lg:mx-10 app:mb-4">
            <!-- <Grid columns="grow auto">
                <Flex column class="b64-textbox-controls overflow-hidden order-1">
                    <Button class="b64-textbox-button bg-transparent" @click="paste">
                        <IconClipboardPaste alt="Paste" />
                    </Button>
                    <Button class="b64-textbox-button bg-transparent" @click="fromFile">
                        <Icon :icon=FileIcon alt="From file" />
                    </Button>
                </Flex>
                <TextBox v-model="input" :placeholder="mode === 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="peer focus:hover:bg-transparent rounded-r-none! border-r-0! h-full resize-none" multiline />
            </Grid> -->
            <TextBoxTools toolbar-position="right">
                <TextBox v-model="input" :placeholder="mode === 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="resize-none" multiline />
                <template #tools>
                    <Button variant="ghost" icon class="b64-textbox-button" @click="paste">
                        <IconClipboardPaste alt="Paste" />
                    </Button>
                    <Button variant="ghost" icon @click="fromFile">
                        <IconDocument alt="From file" />
                    </Button>
                </template>
            </TextBoxTools>
            <!-- <BinaryInput placeholder="Test" :model-value="{ editingType: 'utf8', value: '' }">

            </BinaryInput> -->

            <!-- <Flex class="items-center justify-center">
                <Button class="w-fit p-button-icon" @click="mode = mode === 'atob' ? 'btoa' : 'atob'"
                    :title="`Swap to ${mode === 'atob' ? 'Normal to Base64' : 'Base64 to Normal'} mode`">
                    <Icon :icon=ArrowSwap alt="" />
                </Button>
            </Flex> -->

            <!-- <Grid columns="grow auto">
                <TextBox :model-value="output" :placeholder="mode !== 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="peer focus:hover:bg-transparent rounded-r-none! border-r-0! h-full resize-none" multiline />
                <Flex column class="b64-textbox-controls overflow-hidden">
                    <Button class="b64-textbox-button bg-transparent" @click="copy">
                        <IconCopy alt="Copy" />
                    </Button>
                    <Button class="b64-textbox-button bg-transparent" @click="toFile">
                        <Icon :icon=SaveFileIcon alt="Save file" />
                    </Button>
                </Flex>
            </Grid> -->

            <TextBoxTools toolbar-position="right">
                <TextBox v-model="input" :placeholder="mode === 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="resize-none" multiline />
                <template #tools>
                    <Button variant="ghost" icon class="b64-textbox-button" @click="copy">
                        <IconCopy alt="Copy" />
                    </Button>
                    <Button variant="ghost" icon @click="toFile">
                        <IconDocumentArrowDown alt="Save file" />
                    </Button>
                </template>
            </TextBoxTools>
        </Grid>
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
@reference '~~/layers/simplytools-ui/app/app.css';

.b64-textbox-controls {
    @apply rounded-control rounded-l-none border bg-control-primary border-border-control-primary border-l-0 border-b-2 border-b-control-strong peer-focus:border-b-textbox-accent-highlight peer-focus:bg-transparent;
}

@layer components {
    .b64-textbox-button {
        @apply p-button-icon pt-1 border-none rounded-none;
    }
}
</style>