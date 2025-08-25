import * as YAML from 'yaml'
import type { Metadata } from './metadata';
const builtinSnippets = import.meta.glob('~/../public/snippets/*.liquid', { query: '?raw', import: 'default' });
const builtinMeta = import.meta.glob('~/../public/snippets/*.meta.yml', { query: '?raw', import: 'default' });
const regex = /\.\.\/public\/snippets\/(.+)\.liquid/
// export function getLocalSnippets(): string[] {
//     if (!import.meta.client) {
//         return []
//     }
//     localStorage.getItem()
// }
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
        // let res = await fetch(`/snippets/${key}.liquid`)
        // if (!res.ok) {
        //     throw res
        // } else {
        //     return res.text()
        // }
        return txt
    }
    return ''
}
export async function getMetadata(key: string): Promise<Metadata> {
    if (key.startsWith('builtin.')) {
        let txt
        try {
            txt = builtinMeta[`../public/snippets/${key}.meta.yml`]!() as Promise<string>
        } catch {
            throw createError({ status: 404, statusText: 'Snippet Not Found' })
        }
        return YAML.parse(await txt) as Metadata
    }
    return {} as Metadata
}