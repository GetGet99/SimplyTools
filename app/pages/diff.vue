<template>
    <Feature category="none" tool="Text Compare" class="flex flex-col h-full">
        <div class="flex p-4">
            Old Text goes to the left!
            <div class="grow"></div>
            New Text goes to the right!
        </div>
        <MonacoDiffEditor
            ref="editor"
            :options="{ originalEditable: true, readOnly: false, theme: 'simplytools', diffWordWrap: 'on', renderOverviewRuler: false }"
            class="w-full grow bg-control-primary">

        </MonacoDiffEditor>
        <template #summary>
            Easily compare between two pieces of text!
        </template>
        <template #details>
            Powerful difference checker running in your device. Just paste down two pieces of text in each side, and the differences among them will show up!
        </template>
    </Feature>
</template>
<script setup lang="ts">
    if (import.meta.client) {
        const monaco = await useMonaco()
        const transparent = '#00000000'
        monaco.editor.defineTheme('simplytools', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': transparent,
                focusBorder: transparent,
                "widget.shadow": transparent
            }
        })
    }
</script>