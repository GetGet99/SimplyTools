<template>
    <ClientOnly>
        <MonacoEditor ref="editorRef" :lang :options="{
            theme,
            minimap: {
                enabled: false
            },
            readOnly: readonly,
            scrollBeyondLastLine: false,
        }" v-model="code" class="base-bg-control-primary" v-get-element="disableContrlP" />
    </ClientOnly>
</template>
<script setup lang="ts">
import type { editor as e } from 'monaco-editor';
function disableContrlP(el: HTMLElement) {
    el.addEventListener('keypress', function (event) {
        //@ts-ignore
        if (event.keyCode === 80 && (event.ctrlKey || event.metaKey) && !event.altKey && (!event.shiftKey || window.chrome || window.opera)) {
            event.preventDefault();
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {
                event.stopPropagation();
            }
            editor.value?.trigger('ctrl-shift-p', 'editor.action.quickCommand', null)
            return;
        }
    }, true)
}
await useMonacoWithOurTheme();
const code = defineModel<string>()
const props = defineProps<{ readonly?: boolean, lang: string }>()
const editorRef = useTemplateRef("editorRef")
const editor = computed(() => editorRef.value?.$editor)
defineExpose({ editor })

function onResize() {
    editor.value?.layout({} as e.IDimension, true)
}
let scheme = useColorScheme()
let theme = `simplytools-${scheme.value}`
watch(scheme, async () => {
    theme = `simplytools-${scheme.value}`;
    (await useMonaco()).editor.setTheme('simplytools-' + scheme)
})
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
    /* background-color: var(--background-color-control-primary) !important; */
    background: transparent;
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