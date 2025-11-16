import * as YAML from 'yaml'
import type { UUID } from '../types'
export type NoteFileName = `${UUID}.toast-md`
export async function getNotesAsync(): Promise<NoteFileName[]> {
    if (!import.meta.client) {
        return []
    }
    return (await Native.KeyValueStorage.getStringAsync('/notes/items'))?.split(',') as NoteFileName[] ?? []
}

export async function getNoteAsync(key: NoteFileName): Promise<string> {
    if (!import.meta.client)
        return ''
    return (await Native.KeyValueStorage.getStringAsync(`/notes/notes/${key}`)) ?? ''
}
export async function getNoteTitleAsync(key: NoteFileName): Promise<string> {
    if (!import.meta.client)
        return ''
    return (await Native.KeyValueStorage.getStringAsync(`/notes/title/${key}`)) ?? ''
}

export async function createNewNoteAsync() {
    if (import.meta.client) {
        let key = crypto.randomUUID()
        if (await Native.KeyValueStorage.getStringAsync(`/notes/notes/${key}`) !== null) {
            throw createError({ status: 500, statusMessage: 'UUID collision. Please try again' })
        }
        await Native.KeyValueStorage.setStringAsync(`/notes/notes/${key}`, '')
        await Native.KeyValueStorage.setStringAsync(`/notes/title/${key}`, 'Untitled Note')
        let items = (await Native.KeyValueStorage.getStringAsync('/notes/items'))?.split(',') ?? []
        items.push(key)
        await Native.KeyValueStorage.setStringAsync('/notes/items', items.join(','))
        return key
    }
    return ''
}
export async function useNoteAsync(key: NoteFileName): Promise<Ref<string>> {
    let val: Ref<string>
    if (import.meta.client) {
        const code = await Native.KeyValueStorage.getStringAsync(`/notes/notes/${key}`)
        if (code === null) {
            throw createError({ status: 404, statusText: 'Note not found' })
        }
        val = ref(code)
    } else {
        val = ref('')
    }
    watch(val, async () => {
        await Native.KeyValueStorage.setStringAsync(`/notes/notes/${key}`, val.value)
    })
    return val
}
export async function useNoteTitleAsync(key: NoteFileName): Promise<Ref<string>> {
    let val: Ref<string>
    if (import.meta.client) {
        const code = await Native.KeyValueStorage.getStringAsync(`/notes/title/${key}`)
        if (code === null) {
            throw createError({ status: 404, statusText: 'Note not found' })
        }
        val = ref(code)
    } else {
        val = ref('')
    }
    watch(val, async () => {
        await Native.KeyValueStorage.setStringAsync(`/notes/title/${key}`, val.value)
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