export async function getListIdsAsync(): Promise<UUID[]> {
    if (!import.meta.client) {
        return []
    }
    return ((await Native.KeyValueStorage.getStringAsync('/random/list/ids'))?.split(',') ?? []) as UUID[]
}

export async function getListAsync(key: UUID): Promise<string[]> {
    return (await getListRawAsync(key)).split('\n').map(line => {
        const trimmed = line.trim()
        if (trimmed === '')
            return null
        if (trimmed.startsWith('#'))
            return null
        return trimmed
    }).filter((x): x is string => x !== null)
}
export async function getListRawAsync(key: UUID): Promise<string> {
    if (!import.meta.client)
        return ''
    return (await Native.KeyValueStorage.getStringAsync(`/random/list/${key}/items`)) ?? ''
}
export async function getListNameAsync(key: UUID): Promise<string> {
    if (!import.meta.client)
        return ''
    return (await Native.KeyValueStorage.getStringAsync(`/random/list/${key}/name`)) ?? ''
}
async function setListRawAsync(key: UUID, val: string) {
    if (import.meta.client) {
        await Native.KeyValueStorage.setStringAsync(`/random/list/${key}/items`, val)
    }
}
async function setListNameAsync(key: UUID, val: string) {
    if (import.meta.client) {
        await Native.KeyValueStorage.setStringAsync(`/random/list/${key}/name`, val)
    }
}
export async function useListRawEditableAsync(key: Ref<UUID> | UUID): Promise<Ref<string>> {
    if (typeof key === 'string') {
        key = ref(key)
    }
    let val = ref(await getListRawAsync(key.value) || '')
    watch(key, async () => {
        val.value = await getListRawAsync(key.value) || ''
    }, { immediate: true })
    watch(val, async () => {
        await setListRawAsync(key.value, val.value)
    })
    return val
}
export async function useListNameEditable(key: Ref<UUID> | UUID): Promise<Ref<string>> {
    if (typeof key === 'string') {
        key = ref(key)
    }
    let val = ref(await getListNameAsync(key.value) || '')
    watch(key, async () => {
        val.value = await getListNameAsync(key.value) || ''
    }, { immediate: true })
    watch(val, async () => {
        await setListNameAsync(key.value, val.value)
    })
    return val
}
export async function createNewListAsync(remixKey?: UUID, customFallbackText?: string, customName?: string): Promise<UUID> {
    if (import.meta.client) {
        let key = crypto.randomUUID()
        if (await Native.KeyValueStorage.getStringAsync(`/random/list/${key}/items`) !== null) {
            throw createError({ status: 500, statusMessage: 'UUID collision. Please try again' })
        }
        let listRaw = remixKey === undefined ? (customFallbackText ?? '# Add your list items here, separate them by new lines.\n# "#" at the beginning of the line is comment. These items won\'t be included') : await getListRawAsync(remixKey)
        await Native.KeyValueStorage.setStringAsync(`/random/list/${key}/items`, listRaw)
        await Native.KeyValueStorage.setStringAsync(`/random/list/${key}/name`, customName ?? 'Unnamed List')

        let items = (await Native.KeyValueStorage.getStringAsync('/random/list/ids'))?.split(',') ?? []
        items.push(key)
        await Native.KeyValueStorage.setStringAsync('/random/list/ids', items.join(','))
        return key
    }
    throw createError({ statusText: 'Cannot create list on server', statusCode: 500 })
}
export async function deleteListAsync(key: UUID) {
    if (import.meta.client) {
        let items = (await Native.KeyValueStorage.getStringAsync('/random/list/ids'))?.split(',') ?? []
        items = items.filter(x => x !== key)
        await Native.KeyValueStorage.setStringAsync('/random/list/ids', items.join(','))

        await Native.KeyValueStorage.removeAsync(`/random/list/${key}/items`)
        await Native.KeyValueStorage.removeAsync(`/random/list/${key}/name`)
    }
}
export type RandomListTools = 'spinner' | 'wheel' | 'card'
export async function useRandomListItemPageAsync(forPage: 'viewer' | 'editor' | RandomListTools) {
    const key = useRoute().params.fileName as UUID
    const name = await useListNameEditable(key)
    const page = RandomCategory.pages.find(x => x.path === 'list')!
    const capitalize = `${forPage.charAt(0).toUpperCase()}${forPage.slice(1)}`
    // Client Only Area
    if (import.meta.client) {
        if (name.value === null) {
            throw createError({ status: 404, statusText: 'List not found' })
        } else {
            usePageInfo({
                ...page, title: forPage === 'editor' ? computed(() => `Editing ${name.value}`) : name, breadcrumb: [
                    forPage === 'editor' ? {
                        type: 'textbox',
                        text: name
                    } : {
                        type: 'link',
                        text: name,
                        href: `/random/list/${key}`
                    },
                    ...((forPage !== 'editor' && forPage !== 'viewer') ? [{
                        type: 'link',
                        text: capitalize,
                        href: `/random/list/${key}/${forPage}`
                    }] satisfies TitleBarBreadcrumbItem[] : []),
                ],
                // inPageTitle: capitalize
            })
        }
    } else {
        usePageInfo({
            ...page, title: 'Loading...', breadcrumb: [{
                type: 'text',
                text: 'Loading...'
            }]
        })
    }
    return key
}
export function useRandomNewListPage(forPage: RandomListTools) {
    const page = RandomCategory.pages.find(x => x.path === forPage)!
    return usePageInfo(page)
}