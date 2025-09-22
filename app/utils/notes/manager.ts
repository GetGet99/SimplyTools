import * as YAML from 'yaml'
import type { UUID } from '../types'
export type NoteFileName = `${UUID}.toast-md`
export function getNotes(): NoteFileName[] {
    if (!import.meta.client) {
        return []
    }
    return localStorage.getItem('/notes/items')?.split(',') as NoteFileName[] ?? []
}

export function getNote(key: NoteFileName): string {
    if (!import.meta.client)
        return ''
    return localStorage.getItem(`/notes/notes/${key}`) ?? ''
}
export function getNoteTitle(key: NoteFileName): string {
    if (!import.meta.client)
        return ''
    return localStorage.getItem(`/notes/title/${key}`) ?? ''
}

export async function createNewNote() {
    if (import.meta.client) {
        let key = crypto.randomUUID()
        if (localStorage.getItem(`/notes/notes/${key}`) !== null) {
            throw createError({ status: 500, statusMessage: 'UUID collision. Please try again' })
        }
        localStorage.setItem(`/notes/notes/${key}`, '')
        localStorage.setItem(`/notes/title/${key}`, 'Untitled Note')
        let items = localStorage.getItem('/notes/items')?.split(',') ?? []
        items.push(key)
        localStorage.setItem('/notes/items', items.join(','))
        return key
    }
    return ''
}
export function useNote(key: NoteFileName): Ref<string> {
    let val: Ref<string>
    if (import.meta.client) {
        const code = localStorage.getItem(`/notes/notes/${key}`)
        if (code === null) {
            throw createError({ status: 404, statusText: 'Note not found' })
        }
        val = ref(code)
    } else {
        val = ref('')
    }
    watch(val, () => {
        localStorage.setItem(`/notes/notes/${key}`, val.value)
    })
    return val
}
export function useNoteTitle(key: NoteFileName): Ref<string> {
    let val: Ref<string>
    if (import.meta.client) {
        const code = localStorage.getItem(`/notes/title/${key}`)
        if (code === null) {
            throw createError({ status: 404, statusText: 'Note not found' })
        }
        val = ref(code)
    } else {
        val = ref('')
    }
    watch(val, () => {
        localStorage.setItem(`/notes/title/${key}`, val.value)
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