export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['nuxt-monaco-editor'],
    css: [
        '~~/layers/simplytools-ui/app/app.css'
    ],
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types'],
    },
    extends: [
        '../simplytools-ui'
    ]
})