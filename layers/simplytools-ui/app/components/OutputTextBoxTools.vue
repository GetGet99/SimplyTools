<template>
    <TextBoxTools :toolbar-position="toolbarPosition ?? 'right'">
        <slot />
        <template #tools>
            <TextBoxToolsButton icon @click="copy" title="Copy to clipboard">
                <IconCopy />
            </TextBoxToolsButton>
            <TextBoxToolsButton icon @click="toFile" title="Save to file">
                <IconSave />
            </TextBoxToolsButton>
            <slot name="tools" />
        </template>
    </TextBoxTools>
</template>
<script setup lang="ts">
const props = defineProps<{ toolbarPosition?: 'left' | 'right' | 'top' | 'bottom', output: string, filenameHint: string }>()
function copy() {
    navigator.clipboard.writeText(props.output)
}
function toFile() {
    const blob = new Blob([props.output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.filenameHint || 'output.txt'
    a.click()
    URL.revokeObjectURL(url)
}
</script>