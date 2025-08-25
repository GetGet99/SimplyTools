<template>
    <MonacoEditor ref="editorRef" :options="{
        theme: 'simplytools-dark',
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
    // Function to apply the appropriate theme
    async function applyColorScheme(scheme: 'dark' | 'light') {
        (await useMonaco()).editor.setTheme('simplytools-' + scheme)
    }

    if (window?.matchMedia) {
        // Detect the initial color scheme
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        applyColorScheme(prefersDarkScheme.matches ? 'dark' : 'light');

        function changeHandler(event : MediaQueryListEvent) {
            applyColorScheme(event.matches ? 'dark' : 'light');
        }
        // Listen for changes in the color scheme
        onMounted(() => {
            prefersDarkScheme.addEventListener('change', changeHandler);
        })
        onUnmounted(() => {
            prefersDarkScheme.removeEventListener('change', changeHandler);
        })
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

    .monaco-editor,
    .monaco-diff-editor,
    .monaco-component {
        --vscode-editorStickyScroll-background: var(--background-color-control-primary) !important;
    }

    .monaco-editor {
        width: unset !important;
        height: unset !important;
    }

    .monaco-editor .sticky-widget {
        backdrop-filter: blur(5px);
    }
</style>