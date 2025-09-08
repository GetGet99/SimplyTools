import { createCategory, type Page } from "./_helper"

export type AppPage = {
    appName: string
} & Page

export const Apps = createCategory({
    type: 'category',
    name: "Apps",
    shortName: "Apps",
    path: ''
}, [
    {
        title: 'Quick Templates',
        appName: 'SimplySnippets',
        path: 'snippets',
        desc: 'Quickly find and use code templates for your projects, or create your own custom snippets.'
    },
    {
        title: 'Sounds',
        appName: 'SimplySounds',
        inPageTitle: 'Make your own sounds!',
        path: 'sounds',
        desc: 'Quickly create sounds from notes and loops'
    },
] as AppPage[])