import { createCategory, type Page } from "./_helper"
export const AICategory = createCategory({
    type: 'category',
    name: "SimplyAITools",
    shortName: "AI",
    path: '/ai'
}, [
    {
        title: 'Chat',
        path: 'chat',
        desc: 'Simply chatting with built-in AI'
    },
    {
        title: 'Summary',
        path: 'summarizer',
        desc: 'Summarize contents with built-in AI'
    },
])
// don't include as tools
export const AIPolicyPage = {
    title: 'Policy',
    path: 'policy',
    desc: 'Policy for AI tools',
    parent: AICategory
} satisfies Page