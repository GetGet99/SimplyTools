import * as YAML from 'yaml'
import { extractYamlComment, type Metadata } from './metadata';
const builtinSnippets = import.meta.glob('~/../public/snippets/*.liquid', { query: '?raw', import: 'default' });
const builtinMeta = import.meta.glob('~/../public/snippets/*.meta.yml', { query: '?raw', import: 'default' });
const regex = /\.\.\/public\/snippets\/(.+)\.liquid/
export async function getLocalSnippetsAsync(): Promise<string[]> {
    if (!import.meta.client) {
        return []
    }
    return (await Native.KeyValueStorage.getStringAsync('/snippets/items'))?.split(',') ?? []
}
export function getBuiltInSnippets(): string[] {
    return Object.keys(builtinSnippets).map(x => x.slice("../public/snippets/".length).slice(undefined, -('.liquid'.length)))
}

export async function getSnippetAsync(key: string): Promise<string> {
    if (key.startsWith('builtin.')) {
        let txt
        try {
            txt = builtinSnippets[`../public/snippets/${key}.liquid`]!() as Promise<string>
        } catch {
            throw createError({ status: 404, statusText: 'Snippet Not Found' })
        }
        return txt
    } else if (key.startsWith('local.')) {
        if (!import.meta.client)
            return ''
        return (await Native.KeyValueStorage.getStringAsync(`/snippets/snippets/${key}`)) ?? ''
    }
    return ''
}
export async function getMetadataAsync(key: string): Promise<Metadata> {
    return YAML.parse(await getMetadataStringAsync(key))
}
export async function getMetadataSchemaAsync(key: string) {
    return YAML.parseDocument(await getMetadataStringAsync(key))
}
export async function getMetadataExampleAsync(key: string) {
    return String(new YAML.Document((await getMetadataSchemaAsync(key)).get('example')))
}
export async function getMetadataPropertiesAsync(key: string) {
    return String(new YAML.Document((await getMetadataSchemaAsync(key)).get('properties')))
}
export async function getMetadataStringAsync(key: string) {
    let txt: Promise<string> | string = ''
    if (key.startsWith('builtin.')) {
        try {
            txt = builtinMeta[`../public/snippets/${key}.meta.yml`]!() as Promise<string>
        } catch {
            throw createError({ status: 404, statusText: 'Snippet Not Found' })
        }
    } else if (key.startsWith('local.')) {
        if (!import.meta.client) {
            txt = ''
        } else {
            txt = await Native.KeyValueStorage.getStringAsync(`/snippets/metadata/${key}`)! ?? ''
        }
        if (txt === null) {
            throw createError({ status: 404, statusText: 'Snippet Not Found' })
        }
    }
    return txt
}
async function getSavedInputAsync(key: string): Promise<string | null> {
    if (import.meta.client) {
        return await Native.KeyValueStorage.getStringAsync(`/snippets/input/${key}`) ?? ''
    } else {
        return ''
    }
}
async function setSavedInputAsync(key: string, val: string) {
    if (import.meta.client) {
        await Native.KeyValueStorage.setStringAsync(`/snippets/input/${key}`, val)
    }
}
export async function useSavedInput(key: Ref<string>): Promise<Ref<string>> {
    let val = ref(await getSavedInputAsync(key.value) || await getExampleFromMetadata())
    watch(key, async () => {
        val.value = await getSavedInputAsync(key.value) || await getExampleFromMetadata()
    }, { immediate: true })
    watch(val, async () => {
        await setSavedInputAsync(key.value, val.value)
    })
    async function getExampleFromMetadata() {
        const initialMeta = await getMetadataAsync(key.value)
        return YAML.stringify(initialMeta.example)
    }
    return val
}
export async function createNewSnippetAsync(remixKey: string) {
    if (import.meta.client) {
        let key = `local.${crypto.randomUUID()}`
        if (await Native.KeyValueStorage.getStringAsync(`/snippets/snippets/${key}`) !== null) {
            throw createError({ status: 500, statusMessage: 'UUID collision. Please try again' })
        }
        let snippet =  await getSnippetAsync(remixKey)
        let meta = await getMetadataSchemaAsync(remixKey)
        meta.set('name', "Remix: " + (meta.get('name')?.toString() ?? ''))
        snippet = replaceMetaContent(snippet, String(meta))
        await Native.KeyValueStorage.setStringAsync(`/snippets/snippets/${key}`, snippet)
        await Native.KeyValueStorage.setStringAsync(`/snippets/metadata/${key}`, String(meta))
        let items = (await Native.KeyValueStorage.getStringAsync('/snippets/items'))?.split(',') ?? []
        items.push(key)
        await Native.KeyValueStorage.setStringAsync('/snippets/items', items.join(','))
        return key
    }
    return ''
}
export async function deleteSnippetAsync(key: string) {
    if (import.meta.client) {
        if (!key.startsWith('local.'))
            throw new Error(`Cannot delete ${key}: not local`)
        
        let items = (await Native.KeyValueStorage.getStringAsync('/snippets/items'))?.split(',') ?? []
        items = items.filter(x => x !== key)
        await Native.KeyValueStorage.setStringAsync('/snippets/items', items.join(','))
        
        await Native.KeyValueStorage.removeAsync(`/snippets/snippets/${key}`)
        await Native.KeyValueStorage.removeAsync(`/snippets/metadata/${key}`)
    }
    return ''
}
export async function useLocalSnippetRefAsync(key: string): Promise<Ref<string>> {
    if (!key.startsWith('local.')) {
        createError({ status: 400, statusText: "Forbidden: Not allowed to edit non local snippet." })
    }
    let val : Ref<string>
    if (import.meta.client) {
        const code = await Native.KeyValueStorage.getStringAsync(`/snippets/snippets/${key}`)
        if (code === null) {
            throw createError({ status: 404, statusText: 'Snippet not found' })
        }
        val = ref(code)
    } else {
        val = ref('')
    }
    watch(val, async () => {
        await Native.KeyValueStorage.setStringAsync(`/snippets/snippets/${key}`, val.value)
        await Native.KeyValueStorage.setStringAsync(`/snippets/metadata/${key}`, extractYamlComment(val.value) ?? '')
    })
    return val
}
export function replaceMetaContent(input: string, newMetaContent: string): string {
  // Regex to capture the meta block, preserving optional "-" around tags
  const regex = /(\{%-?\s*meta\s*-?%\})([\s\S]*?)(\{%-?\s*endmeta\s*-?%\})/;

  return input.replace(regex, (_match, openingTag, _oldContent, closingTag) => {
    // Keep the same opening and closing tags, insert new content
    return `${openingTag}\n${newMetaContent}\n${closingTag}`;
  });
}