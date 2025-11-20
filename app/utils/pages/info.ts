import type { Category } from "./_helper"
import { AICategory } from "./ai"
import { Apps } from "./app"
import { DevCategory } from "./dev"
import { MathCategory } from "./math"
import { Uncategorized } from "./uncategorized"
import { RandomCategory } from "./random"
import { TimeCategory } from "./time"
import { InDevCategory } from "~~/layers/simplytools-dev-pages/app/utils/pages/in-dev"

export const Categories = {
    uncategorized: Uncategorized,
    dev: DevCategory,
    math: MathCategory,
    apps: Apps,
    AI: AICategory,
    random: RandomCategory,
    time: TimeCategory,
    "in-dev": InDevCategory,
} satisfies { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI' | 'random' | 'time' | 'in-dev']: Category } as { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI' | 'random' | 'time' | 'in-dev']: Category }
