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
        return localStorage.getItem(`/snippets/snippets/${key}`) ?? ''
    }
    return ''
}
export async function getMetadata(key: string): Promise<Metadata> {
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
    return YAML.parse(await txt) as Metadata
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
export function useLocalSnippetRef(key?: string): Ref<string> {
    if (key === undefined) {
        if (import.meta.client) {
            key = crypto.randomUUID()
        } else {
            return ref('')
        }
    }
    if (!key.startsWith('local.')) {
        createError({ status: 400, statusText: "Forbidden: Not allowed to edit non local snippet." })
    }
    let val = ref('')
    watch(val, () => {
        localStorage.setItem(`/snippets/snippets/${key}`, val.value)
        localStorage.setItem(`/snippets/metadata/${key}`, extractYamlComment(val.value) ?? '')
    })
    return val
}