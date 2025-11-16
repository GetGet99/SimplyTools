import { Schema, type MarkSpec } from "prosemirror-model";
import {
    schema as markdownDefaultSchema, defaultMarkdownParser,
    defaultMarkdownSerializer
} from "prosemirror-markdown"
export const underlineMarkSpec: MarkSpec = {
    parseDOM: [
        { tag: "u" },
        { style: "text-decoration", getAttrs: value => value === "underline" && null }
    ],
    toDOM() {
        return ["u", 0];
    }
};
export const strikethroughMarkSpec: MarkSpec = {
    parseDOM: [
        { tag: "del" },
        { style: "text-decoration", getAttrs: value => value === "line-through" && null }
    ],
    toDOM() {
        return ["del", 0];
    }
};

export const OurSchema = new Schema<"blockquote" | "image" | "text" | "paragraph" | "code_block" | "doc" | "horizontal_rule" | "heading" | "ordered_list" | "bullet_list" | "list_item" | "hard_break", "link" | "code" | "em" | "strong" | 'underline' | 'strikethrough'>({
    nodes: markdownDefaultSchema.spec.nodes,
    // @ts-ignore
    marks: {
        ...markdownDefaultSchema.spec.marks.toObject(),
        underline: underlineMarkSpec,
        strikethrough: strikethroughMarkSpec,
    }
});

import MarkdownIt from "markdown-it";
// import { markdownItTable }  from 'markdown-it-table'


function customMarkdownPlugin(md: MarkdownIt) {
    // // TABBLE
    // md.use(markdownItTable)
    // UNDERLINE
    function tokenize_underline(state : StateInline, silent : boolean) {
        const start = state.pos;

        // Require two underscores
        if (state.src.charCodeAt(start) !== 0x5F /* _ */ ||
            state.src.charCodeAt(start + 1) !== 0x5F) {
            return false;
        }

        if (silent) return false; // don’t run in validation mode

        let scanned = state.scanDelims(start, true); // count how many underscores
        if (scanned.length < 2) return false;

        const token = state.push("text", "", 0);
        token.content = state.src.slice(start, start + scanned.length);
        state.delimiters.push({
            marker: 0x5F,
            length: scanned.length,
            jump: scanned.length - 1,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
        });

        state.pos += scanned.length;
        return true;
    }

    function postProcess_underline(state: StateInline) {
        const delimiters = state.delimiters;
        for (let i = 0; i < delimiters.length; i++) {
            const startDelim = delimiters[i]!;
            if (startDelim.marker !== 0x5F /* _ */) continue;
            if (startDelim.length !== 2) continue;
            if (startDelim.end === -1) continue;

            const endDelim = delimiters[startDelim.end]!;

            // We only handle pairs of "__"
            if (endDelim.token - startDelim.token === 1) continue;
            if (endDelim.length !== 2) continue;

            const openToken = state.tokens[startDelim.token]!;
            openToken.type = "underline_open";
            openToken.tag = "u";
            openToken.nesting = 1;
            openToken.markup = "__";
            openToken.content = "";

            const closeToken = state.tokens[endDelim.token]!;
            closeToken.type = "underline_close";
            closeToken.tag = "u";
            closeToken.nesting = -1;
            closeToken.markup = "__";
            closeToken.content = "";
        }
        return true;
    }
    md.inline.ruler.before("emphasis", "underline", tokenize_underline);
    md.inline.ruler2.after("emphasis", "underline", postProcess_underline);
    
    function tokenize_strikethrough(state : StateInline, silent : boolean) {
        const start = state.pos;

        // Require two ~
        if (state.src.charCodeAt(start) !== 126 /* ~ */ ||
            state.src.charCodeAt(start + 1) !== 126) {
            return false;
        }

        if (silent) return false; // don’t run in validation mode

        let scanned = state.scanDelims(start, true); // count how many underscores
        if (scanned.length < 2) return false;

        const token = state.push("text", "", 0);
        token.content = state.src.slice(start, start + scanned.length);
        state.delimiters.push({
            marker: 126,
            length: scanned.length,
            jump: scanned.length - 1,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
        });

        state.pos += scanned.length;
        return true;
    }

    function postProcess_strikethrough(state: StateInline) {
        const delimiters = state.delimiters;
        for (let i = 0; i < delimiters.length; i++) {
            const startDelim = delimiters[i]!;
            if (startDelim.marker !== 126 /* ~ */) continue;
            if (startDelim.length !== 2) continue;
            if (startDelim.end === -1) continue;

            const endDelim = delimiters[startDelim.end]!;

            // We only handle pairs of "~~"
            if (endDelim.token - startDelim.token === 1) continue;
            if (endDelim.length !== 2) continue;

            const openToken = state.tokens[startDelim.token]!;
            openToken.type = "strikethrough_open";
            openToken.tag = "del";
            openToken.nesting = 1;
            openToken.markup = "~~";
            openToken.content = "";

            const closeToken = state.tokens[endDelim.token]!;
            closeToken.type = "strikethrough_close";
            closeToken.tag = "del";
            closeToken.nesting = -1;
            closeToken.markup = "~~";
            closeToken.content = "";
        }
        return true;
    }
    md.inline.ruler.after("underline", "strikethrough", tokenize_strikethrough);
    md.inline.ruler2.after("underline", "strikethrough", postProcess_strikethrough);
}

const md = new MarkdownIt("commonmark", { linkify: true })
    .use(customMarkdownPlugin);
import { MarkdownParser } from "prosemirror-markdown";

export const OurMarkdownParser = new MarkdownParser(OurSchema, md as any, {
    ...defaultMarkdownParser.tokens,
    underline: { mark: "underline" },
    strikethrough: { mark: "strikethrough" }
});

import { MarkdownSerializer } from "prosemirror-markdown";
import type StateInline from "markdown-it/lib/rules_inline/state_inline";

export const OurMarkdownSErializer = new MarkdownSerializer(
    {
        ...defaultMarkdownSerializer.nodes
    },
    {
        ...defaultMarkdownSerializer.marks,
        underline: {
            open: "__",
            close: "__",
            mixable: true,
            expelEnclosingWhitespace: true
        },
        strikethrough: {
            open: "~~",
            close: "~~",
            mixable: true,
            expelEnclosingWhitespace: true
        },
    }
);
