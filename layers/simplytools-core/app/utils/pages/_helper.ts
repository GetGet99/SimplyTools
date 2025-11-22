export function createCategory(meta: CategoryWithoutPages, pages: PageWithoutParent[]): Category {
    let cat = { ...meta } as Category
    cat.pages = pages.map(x => ({ ...x, parent: cat } satisfies Page))
    return cat
}