export type Page = PageWithoutParent & { parent: Category }
export type PageWithoutParent = {
    path: string
    title: string
    inPageTitle?: string
    desc: string
}
export type Category = CategoryWithoutPages & { pages: Page[] }
export type CategoryWithoutPages = {
    type: 'category'
    name: string
    shortName: string
    path: string
}
export function createCategory(meta: CategoryWithoutPages, pages: PageWithoutParent[]): Category {
    let cat = { ...meta } as Category
    cat.pages = pages.map(x => ({ ...x, parent: cat } satisfies Page))
    return cat
}