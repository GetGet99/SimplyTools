export async function useMonacoWithOurTheme() {
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
        return monaco
    }
    return null
}