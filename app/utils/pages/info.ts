import type { Category } from "./_helper"
import { AICategory } from "./ai"
import { Apps } from "./app"
import { DevCategory } from "./dev"
import { MathCategory } from "./math"
import { Uncategorized } from "./uncategorized"

export const Categories = {
    uncategorized: Uncategorized,
    dev: DevCategory,
    math: MathCategory,
    apps: Apps,
    AI: AICategory
} satisfies { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI']: Category } as { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI']: Category }
