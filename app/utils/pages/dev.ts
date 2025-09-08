import { createCategory } from "./_helper"
export const DevCategory = createCategory({
    type: 'category',
    name: "SimplyDevTools",
    shortName: "Development",
    path: '/dev'
}, [
    {
        title: 'Base 64 Converter',
        path: 'b64',
        desc: 'A simple <code>atob</code> and <code>btoa</code> GUI wrapper'
    },
    {
        title: 'Programmer Calculator',
        path: 'progcalc',
        desc: 'Calculator in many number bases.'
    },
])