export async function useMonacoWithOurTheme() {
    if (import.meta.client) {
        const monaco = await useMonaco()
        const transparent = '#00000000'
        monaco.editor.defineTheme('simplytools-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': transparent,
                focusBorder: transparent,
                "widget.shadow": transparent,
                "editorStickyScrollHover.background": transparent,
            }
        })
        monaco.editor.defineTheme('simplytools-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': transparent,
                focusBorder: transparent,
                "widget.shadow": transparent,
                "editorStickyScrollHover.background": transparent,
            }
        })
        return monaco
    }
    return null
}