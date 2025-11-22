import { createCategory } from "./pages/_helper"

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
        appName: 'SimplySnippets (Beta)',
        path: 'snippets',
        desc: 'Quickly find and use code templates for your projects, or create your own custom snippets.'
    },
    {
        title: 'Make your own sounds!',
        appName: 'SimplySounds (Alpha)',
        inPageTitle: 'Make your own sounds!',
        path: 'sounds',
        desc: 'Quickly create sounds from notes and loops'
    },
    {
        title: 'Take Notes',
        appName: 'SimplyNotes (Alpha)',
        path: 'notes',
        desc: 'Taking down notes!'
    },
] as AppPage[])