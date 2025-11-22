<template>
    <TextBoxTools :toolbar-position="toolbarPosition ?? 'right'">
        <slot />
        <template #tools>
            <TextBoxToolsButton icon @click="paste" title="Clear and paste from clipboard">
                <IconClipboard />
            </TextBoxToolsButton>
            <TextBoxToolsButton icon @click="fromFile" title="Load from file">
                <IconFolderOpen />
            </TextBoxToolsButton>
            <slot name="tools" />
        </template>
    </TextBoxTools>
</template>
<script setup lang="ts">
const props = defineProps<{ toolbarPosition?: 'left' | 'right' | 'top' | 'bottom' }>()
const model = defineModel<string>({ required: true })
function paste() {
    navigator.clipboard.readText().then(text => {
        model.value = text
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
                model.value = e.target?.result as string
            }
            reader.readAsText(file)
        }
    }
    inputElement.click()
}
</script>