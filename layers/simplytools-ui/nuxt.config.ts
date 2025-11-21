import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    alias: {
        '@simplytools-theme': '~~/layers/simplytools-ui/app/'
    },
    modules: ['reka-ui/nuxt'],
    css: [
        '~~/layers/simplytools-ui/app/app.css'
    ],
    vite: {
        plugins: [tailwindcss()]
    },
    // Important: make Nuxt aware of the custom types
    imports: {
        dirs: ['types'],
    },
    components: [
        { path: './components/layout/', pathPrefix: false },
        { path: './components/primitives/', pathPrefix: false },
        './components'
    ]
})