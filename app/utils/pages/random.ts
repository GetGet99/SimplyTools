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
        title: 'Multi Random Number Generator',
        inPageTitle: 'RNG (Multi)',
        path: 'rng-multi',
        desc: 'A simple RNG (Random Number Generator) that can generate multiple numbers between a given range, either integers or real numbers all at once'
    },
])