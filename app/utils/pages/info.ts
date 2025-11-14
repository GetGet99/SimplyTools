import type { Category } from "./_helper"
import { AICategory } from "./ai"
import { Apps } from "./app"
import { DevCategory } from "./dev"
import { MathCategory } from "./math"
import { Uncategorized } from "./uncategorized"
import { RandomCategory } from "./random"
import { TimeCategory } from "./time"

export const Categories = {
    uncategorized: Uncategorized,
    dev: DevCategory,
    math: MathCategory,
    apps: Apps,
    AI: AICategory,
    random: RandomCategory,
    time: TimeCategory,
} satisfies { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI' | 'random' | 'time']: Category } as { readonly [key in 'uncategorized' | 'dev' | 'math' | 'apps' | 'AI' | 'random' | 'time']: Category }
