import { createCategory, type Page } from "./_helper";

export const Uncategorized = createCategory({
    type: 'category',
    name: "SimplyTools",
    shortName: "",
    path: ''
}, [
    {
        title: 'Cases!',
        inPageTitle: 'Cases',
        path: 'cases',
        desc: 'Want to lowercase? UPPERCASE? swappingCASE? or raNDomcAsE? We got you covered.'
    },
    {
        title: 'Color Playground',
        path: 'colors',
        desc: 'Pick and play with different colors! Transform colors by inverting and more!'
    },
    {
        title: 'Text Compare',
        path: 'diff',
        desc: 'Compare between two pieces of text to see what are the differences.'
    },
    {
        title: 'Pomodoro Timer',
        path: 'pomodoro',
        desc: 'Simple Pomodoro timer to boost your productivity with work and break intervals.'
    },
    {
        title: 'Timer',
        path: 'timer',
        desc: 'Simple timer'
    },
    {
        title: 'Timestamp Converter',
        path: 'timestamp',
        desc: 'Convert dates and times to UNIX timestamps and Discord timestamp formats, with instant previews and copy buttons.'
    },
    {
        title: 'Quick Templates (Snippets)',
        path: 'snippets',
        desc: 'Quickly find and use code templates for your projects, or create your own custom snippets.'
    },
    {
        title: 'QR Code Generator',
        path: 'qr',
        desc: 'Quickly create a QR code.'
    },
])

// don't include as tools
export const PrivacyPage = {
    title: 'Terms of service and Privacy Policy',
    path: 'terms-and-privacy',
    desc: 'Terms of service and Privacy Policy',
    parent: Uncategorized
} satisfies Page