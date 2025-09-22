// Orginal: https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/inputrules.ts

import {
    inputRules, wrappingInputRule, textblockTypeInputRule,
    smartQuotes, emDash, ellipsis
} from "prosemirror-inputrules"
import { NodeType } from "prosemirror-model"
import { OurSchema } from "./markdown"

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
function blockQuoteRule(nodeType: NodeType) {
    return wrappingInputRule(/^\s*>\s$/, nodeType)
}

/// Given a list node type, returns an input rule that turns a number
/// followed by a dot at the start of a textblock into an ordered list.
function orderedListRule(nodeType: NodeType) {
    return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({ order: +match[1]! }),
        (match, node) => node.childCount + node.attrs.order == +match[1]!)
}

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
function bulletListRule(nodeType: NodeType) {
    return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

/// Given a code block node type, returns an input rule that turns a
/// textblock starting with three backticks into a code block.
function codeBlockRule(nodeType: NodeType) {
    return textblockTypeInputRule(/^```$/, nodeType)
}

/// Given a node type and a maximum level, creates an input rule that
/// turns up to that number of `#` characters followed by a space at
/// the start of a textblock into a heading whose level corresponds to
/// the number of `#` signs.
function headingRule(nodeType: NodeType, maxLevel: number) {
    return textblockTypeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"),
        nodeType, match => ({ level: match[1]!.length }))
}

/// A set of input rules for creating the basic block quotes, lists,
/// code blocks, and heading.
export function buildInputRules() {
    let rules = smartQuotes.concat(ellipsis, emDash)
    rules.push(blockQuoteRule(OurSchema.nodes.blockquote))
    rules.push(orderedListRule(OurSchema.nodes.ordered_list))
    rules.push(bulletListRule(OurSchema.nodes.bullet_list))
    rules.push(codeBlockRule(OurSchema.nodes.code_block))
    rules.push(headingRule(OurSchema.nodes.heading, 6))
    return inputRules({ rules })
}

