import type { Category } from "./_helper"
import { AICategory } from "./ai"
import { Apps } from "./app"
import { DevCategory } from "./dev"
import { MathCategory } from "./math"
import { Uncategorized } from "./uncategorized"
import { RandomCategory } from "./random"

export const Categories = {
    uncategorized: Uncategorized,
    dev: DevCategory,
    math: MathCategory,
    apps: Apps,
    AI: AICategory,
    random: RandomCategory,
} satisfies { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI' | 'random']: Category } as { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI']: Category }
