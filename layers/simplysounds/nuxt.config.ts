export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types'],
    },
    components: [
        { path: './components', prefix: 'SimplySounds' }
    ],
    extends: [
        '../simplytools-ui',
    ]
})