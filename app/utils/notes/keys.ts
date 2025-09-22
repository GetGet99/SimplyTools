import {
    wrapIn, setBlockType, chainCommands, toggleMark, exitCode,
    joinUp, joinDown, lift, selectParentNode
} from "prosemirror-commands"
import { wrapInList, splitListItem, liftListItem, sinkListItem } from "prosemirror-schema-list"
import { undo, redo } from "prosemirror-history"
import { undoInputRule } from "prosemirror-inputrules"
import type { Command } from "prosemirror-state"
import { Schema } from "prosemirror-model"
import { OurSchema } from './markdown'

const mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false

export function buildKeymap() {
    let keys: { [key: string]: Command } = {}
    function bind(key: string, cmd: Command) {
        keys[key] = cmd
    }

    bind("Mod-z", undo)
    bind("Shift-Mod-z", redo)
    bind("Backspace", undoInputRule)
    if (!mac) bind("Mod-y", redo)

    bind("Alt-ArrowUp", joinUp)
    bind("Alt-ArrowDown", joinDown)
    bind("Mod-BracketLeft", lift)
    bind("Escape", selectParentNode)

    bind("Mod-b", toggleMark(OurSchema.marks.strong))
    bind("Mod-B", toggleMark(OurSchema.marks.strong))
    bind("Mod-i", toggleMark(OurSchema.marks.em))
    bind("Mod-I", toggleMark(OurSchema.marks.em))
    bind("Mod-`", toggleMark(OurSchema.marks.code))
    bind("Shift-Ctrl-8", wrapInList(OurSchema.nodes.bullet_list))
    bind("Shift-Ctrl-9", wrapInList(OurSchema.nodes.ordered_list))
    bind("Ctrl->", wrapIn(OurSchema.nodes.blockquote))
    let cmd = chainCommands(exitCode, (state, dispatch) => {
        if (dispatch) dispatch(state.tr.replaceSelectionWith(OurSchema.nodes.hard_break.create()).scrollIntoView())
        return true
    })
    bind("Mod-Enter", cmd)
    bind("Shift-Enter", cmd)
    if (mac) bind("Ctrl-Enter", cmd)
    bind("Enter", splitListItem(OurSchema.nodes.list_item))
    bind("Mod-[", liftListItem(OurSchema.nodes.list_item))
    bind("Mod-]", sinkListItem(OurSchema.nodes.list_item))
    bind("Shift-Ctrl-0", setBlockType(OurSchema.nodes.paragraph))
    bind("Shift-Ctrl-\\", setBlockType(OurSchema.nodes.code_block))
    for (let i = 1; i <= 6; i++) bind("Shift-Ctrl-" + i, setBlockType(OurSchema.nodes.heading, { level: i }))
    for (let i = 1; i <= 6; i++) bind("Shift-Ctrl-" + i, setBlockType(OurSchema.nodes.horizontal_rule, { level: i }))
    bind("Mod-_", (state, dispatch) => {
        if (dispatch) dispatch(state.tr.replaceSelectionWith(OurSchema.nodes.horizontal_rule.create()).scrollIntoView())
        return true
    })
    return keys
}