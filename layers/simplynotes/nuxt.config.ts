export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    imports: {
        dirs: ['types'],
    },
    components: [
        { path: './components', prefix: 'SimplyNotes' }
    ],
    extends: [
        '../simplytools-ui',
        '../simplytools-code-editor',
    ]
})