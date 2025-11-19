export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types'],
    },
    extends: [
        '../simplytools-ui',
    ],
    components: [
        { path: 'components-autogen', prefix: 'Icon' },
        "components"
    ]
})