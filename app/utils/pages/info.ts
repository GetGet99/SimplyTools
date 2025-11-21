import type { Category } from "./_helper"
import { AICategory } from "./ai"
import { Apps } from "./app"
import { DevCategory } from "./dev"
import { MathCategory } from "./math"
import { Uncategorized } from "./uncategorized"
import { RandomCategory } from "./random"
import { TimeCategory } from "./time"
import { InDevCategory } from "~~/layers/simplytools-dev-pages/app/utils/pages/in-dev"

type CategoriesType = { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI' | 'random' | 'time']: Category } & {
    readonly "in-dev"?: Category
}

export const Categories = {
    uncategorized: Uncategorized,
    dev: DevCategory,
    math: MathCategory,
    apps: Apps,
    AI: AICategory,
    random: RandomCategory,
    time: TimeCategory,
    ... (process.env.NODE_ENV === 'production' ? {} : {
        "in-dev": InDevCategory,
    })
} satisfies CategoriesType as CategoriesType
