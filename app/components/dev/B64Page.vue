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
    <Feature category="dev" tool="Base 64 Converter" class="flex flex-col gap-2 p-2" limit-screen="xl">
        <Flex column class="items-center gap-2">
            <Button @click="mode = mode === 'atob' ? 'btoa' : 'atob'; w.location">Switch to Base 64 {{ mode !== 'atob' ?
                'decoder' : 'encoder' }}</Button>
        </Flex>
        <Grid :rows=2 :lg-rows=1 :lg-columns=2 class="grow gap-2 app:mb-4">
            <InputTextBoxTools v-model="input">
                <TextBox v-model="input" :placeholder="mode === 'atob' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="resize-none" multiline />
            </InputTextBoxTools>
            <OutputTextBoxTools :output filename-hint="mode === 'btoa' ? 'base64.txt' : 'decoded.txt'">
                <TextBox :model-value="output" readonly :placeholder="mode === 'btoa' ? 'Base 64 (A)' : 'Normal Text (B)'"
                    class="resize-none" multiline />
            </OutputTextBoxTools>
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