import { createCategory } from "@simplytools-pages-utils";
export const InDevCategory = createCategory({
    type: 'category',
    name: "In Development Utilities",
    shortName: "In-Dev Utils",
    path: '/in-dev'
}, [
    {
        title: 'Icon Gallery',
        path: 'icon-gallery',
        desc: 'Browse and preview all available icons.'
    }
])