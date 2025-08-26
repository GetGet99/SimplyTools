import * as YAML from 'yaml'
import { extractYamlComment, type Metadata } from './metadata';
const builtinSnippets = import.meta.glob('~/../public/snippets/*.liquid', { query: '?raw', import: 'default' });
const builtinMeta = import.meta.glob('~/../public/snippets/*.meta.yml', { query: '?raw', import: 'default' });
const regex = /\.\.\/public\/snippets\/(.+)\.liquid/
export function getLocalSnippets(): string[] {
    if (!import.meta.client) {
        return []
    }
    return localStorage.getItem('/snippets/items')?.split(',') ?? []
}
export function getBuiltInSnippets(): string[] {
    return Object.keys(builtinSnippets).map(x => x.slice("../public/snippets/".length).slice(undefined, -('.liquid'.length)))
}

export async function getSnippet(key: string): Promise<string> {
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
        return localStorage.getItem(`/snippets/snippets/${key}`) ?? ''
    }
    return ''
}
export async function getMetadata(key: string): Promise<Metadata> {
    return YAML.parse(await getMetadataString(key))
}
export async function getMetadataSchema(key: string) {
    return YAML.parseDocument(await getMetadataString(key))
}
export async function getMetadataExample(key: string) {
    return String(new YAML.Document((await getMetadataSchema(key)).get('example')))
}
export async function getMetadataProperties(key: string) {
    return String(new YAML.Document((await getMetadataSchema(key)).get('properties')))
}
export async function getMetadataString(key: string) {
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
            txt = localStorage.getItem(`/snippets/metadata/${key}`)!
        }
        if (txt === null) {
            throw createError({ status: 404, statusText: 'Snippet Not Found' })
        }
    }
    return txt
}
function getSavedInput(key: string): string | null {
    if (import.meta.client) {
        return localStorage.getItem(`/snippets/input/${key}`) ?? ''
    } else {
        return ''
    }
}
export function setSavedInput(key: string, val: string) {
    if (import.meta.client) {
        localStorage.setItem(`/snippets/input/${key}`, val)
    }
}
export async function useSavedInput(key: Ref<string>): Promise<Ref<string>> {
    let val = ref(getSavedInput(key.value) || await getExampleFromMetadata())
    watch(key, async () => {
        val.value = getSavedInput(key.value) || await getExampleFromMetadata()
    }, { immediate: true })
    watch(val, () => {
        setSavedInput(key.value, val.value)
    })
    async function getExampleFromMetadata() {
        const initialMeta = await getMetadata(key.value)
        return YAML.stringify(initialMeta.example)
    }
    return val
}
export async function createNewSnippet(remixKey: string) {
    if (import.meta.client) {
        let key = `local.${crypto.randomUUID()}`
        if (localStorage.getItem(`/snippets/snippets/${key}`) !== null) {
            throw createError({ status: 500, statusMessage: 'UUID collision. Please try again' })
        }
        let snippet =  await getSnippet(remixKey)
        let meta = await getMetadataSchema(remixKey)
        meta.set('name', "Remix: " + (meta.get('name')?.toString() ?? ''))
        snippet = replaceMetaContent(snippet, String(meta))
        localStorage.setItem(`/snippets/snippets/${key}`, snippet)
        localStorage.setItem(`/snippets/metadata/${key}`, String(meta))
        let items = localStorage.getItem('/snippets/items')?.split(',') ?? []
        items.push(key)
        localStorage.setItem('/snippets/items', items.join(','))
        return key
    }
    return ''
}
export async function deleteSnippet(key: string) {
    if (import.meta.client) {
        if (!key.startsWith('local.'))
            throw new Error(`Cannot delete ${key}: not local`)
        localStorage.removeItem(`/snippets/snippets/${key}`)
        localStorage.removeItem(`/snippets/metadata/${key}`)
    }
    return ''
}
export function useLocalSnippetRef(key: string): Ref<string> {
    if (!key.startsWith('local.')) {
        createError({ status: 400, statusText: "Forbidden: Not allowed to edit non local snippet." })
    }
    let val : Ref<string>
    if (import.meta.client) {
        const code = localStorage.getItem(`/snippets/snippets/${key}`)
        if (code === null) {
            throw createError({ status: 404, statusText: 'Snippet not found' })
        }
        val = ref(code)
    } else {
        val = ref('')
    }
    watch(val, () => {
        localStorage.setItem(`/snippets/snippets/${key}`, val.value)
        localStorage.setItem(`/snippets/metadata/${key}`, extractYamlComment(val.value) ?? '')
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