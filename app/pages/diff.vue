<template>
    <Feature category="none" tool="Text Compare" class="flex flex-col h-full">
        <Flex class="p-4">
            Old Text goes to the left!
            <Grow />
            New Text goes to the right!
        </Flex>
        <MonacoDiffEditor ref="editor"
            :options="{ originalEditable: true, readOnly: false, theme, diffWordWrap: 'on', renderOverviewRuler: false }"
            class="w-full grow bg-control-primary">

        </MonacoDiffEditor>
        <template #summary>
            Easily compare between two pieces of text!
        </template>
        <template #details>
            Powerful difference checker running in your device. Just paste down two pieces of text in each side, and the
            differences among them will show up!
        </template>
    </Feature>
</template>
<script setup lang="ts">
setPageInfo(Uncategorized.pages.find(x => x.path === 'diff'))
await useMonacoWithOurTheme()
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
</script>