<template>
    <ClientOnly>
        <MonacoEditor ref="editorRef" :lang :options="{
            theme,
            minimap: {
                enabled: false
            },
            readOnly: readonly,
            scrollBeyondLastLine: false,
        }" v-model="code" class="base-bg-control-primary" />
    </ClientOnly>
</template>
<script setup lang="ts">
    import type { editor as e } from 'monaco-editor';

    await useMonacoWithOurTheme();
    const code = defineModel<string>()
    const props = defineProps<{ readonly?: boolean, lang: string }>()
    const editorRef = useTemplateRef("editorRef")
    const editor = computed(() => editorRef.value?.$editor)
    defineExpose({ editor })

    function onResize() {
        editor.value?.layout({} as e.IDimension, true)
    }
    // Function to apply the appropriate theme
    async function applyColorScheme(scheme: 'dark' | 'light') {
        theme = 'simplytools-' + scheme;
        (await useMonaco()).editor.setTheme('simplytools-' + scheme)
    }
    let theme = 'simplytools-dark'
    if (window?.matchMedia) {
        // Detect the initial color scheme
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        applyColorScheme(prefersDarkScheme.matches ? 'dark' : 'light');

        function changeHandler(event: MediaQueryListEvent) {
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
    watch(() => props.lang, async () => {
        (await useMonaco()).editor.setModelLanguage(editor.value?.getModel()!, props.lang)
    })
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
        --vscode-editorStickyScroll-background: transparent !important;
    }

    .monaco-editor {
        width: unset !important;
        height: unset !important;
    }

    .monaco-editor .sticky-widget {
        backdrop-filter: blur(2em);
        background-color: var(--background-color-control-primary) !important;
    }

    .monaco-editor .sticky-line-content {
        background-color: transparent !important;
    }
    .monaco-editor .sticky-line-number {
        background-color: transparent !important;
    }

    .monaco-editor .sticky-line-content:nth-last-child(1) {
        opacity: 0.5;
    }
</style>