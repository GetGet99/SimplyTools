export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types', 'pages-meta'],
    },
    components: [
        { path: './components', prefix: 'Random' }
    ],
    extends: [
        '../simplytools-ui',
        '../simplytools-code-editor',
    ]
})