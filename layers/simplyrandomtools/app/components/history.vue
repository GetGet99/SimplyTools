<template>
    <details class="w-full">
        <summary class="mt-4">History</summary>
        <Flex column class="w-full gap-2 mt-2">
            <TextBoxTools class="min-h-48">
                <TextBox :model-value multiline readonly placeholder='Press "Generate" button above!' />
                <template #tools>
                    <Button icon="left" title="Copy" variant="ghost" @click="copyHistory">
                        <IconCopy alt="" />
                        Copy All
                    </Button>
                    <Button icon="left" title="Clear" variant="ghost" @click="modelValue = ''">
                        <IconDelete alt="" />
                        Clear History
                    </Button>
                </template>
            </TextBoxTools>
        </Flex>
    </details>
</template>
<script setup lang="ts">

const modelValue = defineModel<string>({ required: true })
function copyHistory() {
    navigator.clipboard.writeText(modelValue.value)
}

</script>