import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['reka-ui/nuxt', 'nuxt-monaco-editor'],
    css: [
        '~/app.css'
    ],
    vite: {
        plugins: [tailwindcss()]
    },
    app: {

        head: {
            meta: [
                { name: 'color-scheme', content: 'dark light' }
            ],
        }
    },
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types'],
    },
})