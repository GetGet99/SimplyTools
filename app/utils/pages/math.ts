import { createCategory } from "./_helper"

export const MathCategory = createCategory({
    type: 'category',
    name: "SimplyMathTools",
    shortName: "Math",
    path: '/math'
}, [{
    title: 'Number Base Convert',
    path: 'numbase',
    desc: 'Simple ways to convert bases'
}])