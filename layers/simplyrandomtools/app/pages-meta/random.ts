import { createCategory } from "../../../simplytools-core/app/utils/pages/_helper"

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
    {
        title: 'Spinner (Alpha)',
        inPageTitle: 'Spinner (Alpha)',
        path: 'spinner',
        desc: 'Randomly picking items with a spinner'
    },
    {
        title: 'Wheel (Alpha)',
        inPageTitle: 'Wheel (Alpha)',
        path: 'wheel',
        desc: 'Randomly picking items with a wheel'
    },
    {
        title: 'Card (Alpha)',
        inPageTitle: 'Card (Alpha)',
        path: 'card',
        desc: 'Randomly picking items with SimplyRandomTools cards system'
    },
])