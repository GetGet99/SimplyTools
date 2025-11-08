import { createCategory } from "./_helper"

export const RandomCategory = createCategory({
    type: 'category',
    name: "SimplyRandomTools",
    shortName: "Random",
    path: '/random'
}, [
    {
        title: 'Random Number Generator',
        inPageTitle: 'RNG',
        path: 'rng',
        desc: 'A simple RNG (Random Number Generator) that can generate numbers between a given range, either integers or real numbers'
    },
    {
        title: 'List (Alpha)',
        inPageTitle: 'List (Alpha)',
        path: 'list',
        desc: 'Randomly picking items from a provided list'
    },
])