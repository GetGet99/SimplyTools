export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    alias: {
        '@simplytools-pages-utils': '~~/layers/simplytools-core/app/utils/pages/_helper.ts',
    },
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types'],
    },
    extends: [
        '../simplytools-ui'
    ]
})