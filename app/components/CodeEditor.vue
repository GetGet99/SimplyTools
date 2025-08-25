<template>
    <MonacoEditor ref="editorRef" :options="{
        theme: 'simplytools',
        minimap: {
            enabled: false
        },
        readOnly: readonly
    }" v-model="code" class="base-bg-control-primary" />
</template>
<script setup lang="ts">
    await useMonacoWithOurTheme();
    const code = defineModel<string>()
    const props = defineProps<{ readonly?: boolean }>()
    const editorRef = useTemplateRef("editorRef")
    const editor = computed(() => editorRef.value?.$editor)
    defineExpose({ editor })
</script>
<style>
    @reference '../app.css';

    @layer base {
        .base-bg-control-primary {
            @apply bg-control-primary;
        }
    }
</style>