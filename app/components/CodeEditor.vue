<template>
    <MonacoEditor ref="editorRef" :options="{
        theme: 'simplytools',
        minimap: {
            enabled: false
        },
        readOnly: readonly,
        scrollBeyondLastLine: false,
    }" v-model="code" class="base-bg-control-primary" />
</template>
<script setup lang="ts">
    import type { editor as e } from 'monaco-editor';

    await useMonacoWithOurTheme();
    const code = defineModel<string>()
    const props = defineProps<{ readonly?: boolean }>()
    const editorRef = useTemplateRef("editorRef")
    const editor = computed(() => editorRef.value?.$editor)
    defineExpose({ editor })

    function onResize() {
        editor.value?.layout({} as e.IDimension, true)
    }

    // Editor on resize
    onMounted(() => {
        window.addEventListener('resize', onResize)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', onResize)
    })
</script>
<style>
    @reference '../app.css';

    @layer base {
        .base-bg-control-primary {
            @apply bg-control-primary;
        }
    }
</style>