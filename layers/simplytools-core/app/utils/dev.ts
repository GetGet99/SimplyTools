import { createCategory } from "./pages/_helper"
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
        title: 'JSON to YAML Converter',
        path: 'json2yaml',
        desc: 'A simple JSON to YAML converter.'
    },
    {
        title: 'YAML to JSON Converter',
        path: 'yaml2json',
        desc: 'A simple YAML to JSON converter.'
    },
    {
        title: 'Programmer Calculator',
        path: 'progcalc',
        desc: 'Calculator in many number bases.'
    },
])