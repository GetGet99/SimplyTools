<script setup lang="ts">
export type BinaryInputData = {
    editingType: 'utf8'
    value: string
} | {
    editingType: 'file',
    value: File
} | {
    editingType: 'hex-binary',
    value: string
}
defineProps<{ placeholder: string }>()
const modelValue = defineModel<BinaryInputData>({ required: true })
function paste() {
    navigator.clipboard.read().then(items => {
        debugger
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
                modelValue.value = {
                    editingType: 'utf8',
                    value: e.target?.result as string
                }
            }
            reader.readAsText(file)
        }
    }
    inputElement.click()
}
function onPaste(e : ClipboardEvent) {
    const data = e.clipboardData
    if (!data) return
    if (data.files.length > 0) {
        // data.files[0]!.
    }
}
import PasteIcon from '@fluentui/svg-icons/icons/clipboard_paste_24_regular.svg?raw'
import FileIcon from '@fluentui/svg-icons/icons/document_24_regular.svg?raw'
</script>
<template>
    <TextBoxTools>
        <TextBox v-if="modelValue.editingType === 'utf8'" :model-value="modelValue.value"
            @update:model-value="value => modelValue = ({ editingType: 'utf8', value: value ?? '' } satisfies BinaryInputData)"
            :placeholder class="resize-none" multiline @paste="onPaste" />
        <template #tools>
            <Button variant="ghost" icon class="border-none rounded-none" @click="paste">
                <Icon :icon=PasteIcon alt="Paste" />
            </Button>
            <Button variant="ghost" icon="left" class="border-none rounded-none" @click="fromFile">
                <Icon :icon=FileIcon alt="From file" />
                From File
            </Button>
        </template>
    </TextBoxTools>
</template>