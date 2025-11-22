import { createCategory } from "./pages/_helper"

export const TimeCategory = createCategory({
    type: 'category',
    name: "SimplyTimeTools",
    shortName: "Time",
    path: '/time'
}, [{
    title: 'Timer',
    path: 'timer',
    desc: 'Simple timer'
}, {
    title: 'Stopwatch',
    path: 'stopwatch',
    desc: 'Simple Stopwatch'
}, {
    title: 'Timestamp Converter',
    path: 'timestamp',
    desc: 'Convert dates and times to UNIX timestamps and Discord timestamp formats, with instant previews and copy buttons.'
}])

