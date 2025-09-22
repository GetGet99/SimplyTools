import { createCategory } from "./_helper"
export const DevCategory = createCategory({
    type: 'category',
    name: "SimplyDevTools",
    shortName: "Development",
    path: '/dev'
}, [
    {
        title: 'Base 64 Encoder',
        path: 'b64/encoder',
        desc: 'A simple base64 encoder.'
    },
    {
        title: 'Base 64 Decoder',
        path: 'b64/decoder',
        desc: 'A simple base64 decoder.'
    },
    {
        title: 'Programmer Calculator',
        path: 'progcalc',
        desc: 'Calculator in many number bases.'
    },
])