import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from "prosemirror-gapcursor"
import { keymap } from 'prosemirror-keymap'
import { buildInputRules } from './input'
import { buildKeymap } from './keys'
export function simplyToolsPlugins() {
    return [
        buildInputRules(),
        keymap(buildKeymap()),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor()
    ]
}