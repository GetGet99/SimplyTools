import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['reka-ui/nuxt', 'nuxt-monaco-editor'],
    css: [
        '~~/layers/theme/app/app.css'
    ],
    vite: {
        plugins: [tailwindcss()]
    },
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types'],
    },
})