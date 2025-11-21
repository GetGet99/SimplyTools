This project is a Nuxt project. Auto import rules apply. No need to manually import things that are auto imported.

This project uses TailwindCSS. You may assume they are used.

We prefer least amount of styling unless it's layout. Please use built in components like `<Button/>`. All base UI components can be found in `layers\simplytools-ui\app\components`, `layers\simplytools-ui\app\components\layout`, `layers\simplytools-ui\app\components\primitives`. All are auto imported without prefix.

File Structure (also applies to layers):
- `app/components`: Reusable components go here. For layers, be sure to check nuxt.config.ts for specific layers for auto import paths.
- `app/utils`: Utility functions and compostables and anything else that should be auto imported goes here. Do not put code that will not be shared across multiple layers here. Use `app/lib` instead. Legacy codes may still not be fully migrated yet.
- `app/lib`: Utility functions and compostables and anything else that will not be shared across multiple layers goes here.
- `app/types`: Type definitions that should be auto imported goes here. Do not put code that will not be shared across multiple layers here that is not `.d.ts`. Use `app/lib` instead. Legacy types may still not be fully migrated yet.
