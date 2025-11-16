// The source code is modified from
// Original: https://github.com/ceifa/monaco-liquid/blob/main/index.ts
import type * as monacoImport from 'monaco-editor'
import { ZodArray, ZodBoolean, ZodNumber, ZodObject, type ZodType, ZodString } from 'zod'
import type { $ZodType } from 'zod/v4/core'

type ILiquidModel = monacoImport.editor.ITextModel & { schemas: Record<string, $ZodType> }
let liquidRegistered = false
export async function useMonacoLiquidLanguage() {
    if (!import.meta.client) return
    if (liquidRegistered) return
    else liquidRegistered = true
    const monaco = await useMonaco()
    monaco.languages.register({ id: 'liquid' })
    monaco.languages.registerHoverProvider('liquid', {
        provideHover: (model: ILiquidModel, position) => {
            const variablePath = getVariablePathAtPosition(model, position)
            if (variablePath) {
                // Split the path by dots and brackets, filter out empty strings
                const pathSegments = variablePath.split(/\.|\[|\]/).filter((segment) => segment !== '')
                const variableName = pathSegments[0]!

                if (Object.prototype.hasOwnProperty.call(model.schemas, variableName)) {
                    const schema = model.schemas[variableName]
                    const pathWithoutVariableName = pathSegments.slice(1)
                    const typeInfo = getTypeInfoFromSchema(schema!, pathWithoutVariableName)
                    if (typeInfo) {
                        return {
                            range: model.getWordAtPosition(position)
                                ? new monaco.Range(
                                    position.lineNumber,
                                    model.getWordAtPosition(position)!.startColumn,
                                    position.lineNumber,
                                    model.getWordAtPosition(position)!.endColumn,
                                )
                                : undefined,
                            contents: [{ value: '**Type**' }, { value: `\`${typeInfo}\`` }],
                        }
                    }
                }
            }
            return null
        },
    })

    monaco.languages.setMonarchTokensProvider('liquid', {
        defaultToken: '',
        tokenPostfix: '.liquid',

        brackets: [
            { open: '{%-', close: '%}', token: 'delimiter.tag.trim.left' },
            { open: '{%', close: '-%}', token: 'delimiter.tag.trim.right' },
            { open: '{%-', close: '-%}', token: 'delimiter.tag.trim.both' },
            { open: '{%', close: '%}', token: 'delimiter.tag' },
            { open: '{{-', close: '}}', token: 'delimiter.output.trim.left' },
            { open: '{{', close: '-}}', token: 'delimiter.output.trim.right' },
            { open: '{{-', close: '-}}', token: 'delimiter.output.trim.both' },
            { open: '{{', close: '}}', token: 'delimiter.output' },
            { open: '{', close: '}', token: 'delimiter.bracket' },
            { open: '(', close: ')', token: 'delimiter.parenthesis' },
            { open: '[', close: ']', token: 'delimiter.array' },
        ],
        //
        tokenizer: {
            root: [
                // Comments
                [/{%-?\s*comment\s*-?%}/, { token: 'comment.block.start', next: '@commentBlock' }],
                // Raw blocks
                [/{%-?\s*raw\s*-?%}/, { token: 'string.raw.start', next: '@rawBlock' }],
                // Meta block
                [/{%-?\s*meta\s*-?%}/, { token: 'meta.block.start', nextEmbedded: 'yaml', next: '@metaBlock' }],
                // Output tags
                [/\{\{-?/, { token: 'delimiter.output', next: '@output' }],
                // Control flow tags
                [/{%-?\s*(if|unless|elsif|else|case|when|for|tablerow|end\w+)\b/, { token: 'keyword.control', next: '@tag' }],
                // Other tags
                [/{%-?\s*(assign|capture|increment|decrement|include|render|cycle|break|continue)\b/, { token: 'keyword', next: '@tag' }],
                // Default tag handler
                [/{%-?/, { token: 'delimiter.tag', next: '@tag' }],
                // Text
                [/[^{]+/, ''],
                [/[{]/, ''],
            ],
            metaBlock: [
                [/{%-?\s*endmeta\s*-?%}/, { token: 'meta.block.end', next: '@pop', nextEmbedded: '@pop' }],
            ],

            output: [[/-?\}\}/, { token: 'delimiter.output', next: '@pop' }], { include: '@liquidExpression' }],

            tag: [[/-?\%}/, { token: 'delimiter.tag', next: '@pop' }], { include: '@liquidExpression' }],

            commentBlock: [
                [/{%-?\s*endcomment\s*-?%}/, { token: 'comment.block.end', next: '@pop' }],
                [/./, 'comment.content'],
            ],

            rawBlock: [
                [/{%-?\s*endraw\s*-?%}/, { token: 'string.raw.end', next: '@pop' }],
                [/./, 'string.raw'],
            ],

            liquidExpression: [
                // Whitespace
                [/\s+/, 'white'],
                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],
                // Strings
                [/"(\\.|[^"\\])*"/, 'string'],
                [/'(\\.|[^'\\])*'/, 'string'],
                // Booleans and nil
                [/\b(true|false|nil)\b/, 'constant.language'],
                // Filters
                [/\|/, { token: 'operator', next: '@filter' }],
                // Variables and properties
                [/[a-zA-Z_][\w\-]*/, 'variable'],
                // Punctuation
                [/[\[\]().,]/, 'delimiter'],
                // Operators
                [/==|!=|<=|>=|<|>|and|or|contains/, 'operator'],
                // Keywords
                [
                    /\b(assign|capture|endcapture|increment|decrement|if|endif|unless|endunless|case|endcase|when|else|elsif|for|endfor|include|with|break|continue|cycle|in|limit|offset|render|tablerow|endtablerow|comment|endcomment|raw|endraw|paginate|endpaginate|form|endform)\b/,
                    'keyword',
                ],
                // Other
                [/./, ''],
            ],

            filter: [
                // Filter name
                [/\s*(\w+)/, 'function'],
                // Parameters
                [/:/, 'operator', '@filterargs'],
                // Next filter or end
                [/\|/, 'operator', '@pop'],
                [/\%}|\}\}/, { token: '@rematch', next: '@pop' }],
            ],

            filterargs: [
                // Whitespace
                [/\s+/, 'white'],
                // String parameters
                [/"(\\.|[^"\\])*"/, 'string'],
                [/'(\\.|[^'\\])*'/, 'string'],
                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],
                // Variables
                [/[a-zA-Z_][\w\-]*/, 'variable'],
                // Punctuation
                [/[,]/, 'delimiter'],
                // End of filter args
                [/\|/, 'operator', '@popall'],
                [/\%}|\}\}/, { token: '@rematch', next: '@popall' }],
            ],
        },
    })
    //
    monaco.languages.setLanguageConfiguration('liquid', {
        comments: {
            blockComment: ['{%- comment -%}', '{%- endcomment -%}'],
        },
        brackets: [
            ['{%', '-%}'],
            ['{%-', '%}'],
            ['{%-', '-%}'],
            ['{%', '%}'],
            ['{{', '-}}'],
            ['{{-', '}}'],
            ['{{-', '-}}'],
            ['{{', '}}'],
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        autoClosingPairs: [
            { open: '{{', close: '}}' },
            { open: '{%', close: '%}' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
        ],
        surroundingPairs: [
            { open: '{%-', close: '%}' },
            { open: '{%', close: '-%}' },
            { open: '{%-', close: '-%}' },
            { open: '{%', close: '%}' },
            { open: '{{-', close: '}}' },
            { open: '{{', close: '-}}' },
            { open: '{{-', close: '-}}' },
            { open: '{{', close: '}}' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
        ],
        folding: {
            markers: {
                start: /^\s*{%-?\s*(comment|raw|if|unless|case|for|tablerow|form|paginate|capture|schema|stylesheet|javascript|layout|block|section|style|liquid|meta)\b.*-?%}/,
                end: /^\s*{%-?\s*end(comment|raw|if|unless|case|for|tablerow|form|paginate|capture|schema|stylesheet|javascript|layout|block|section|style|liquid|meta)\b.*-?%}/,
            },
        },
    })

    monaco.languages.registerCompletionItemProvider('liquid', {
        triggerCharacters: ['.', '|', '[', ' '], // ['.', ' ', '{', '%', '|'],
        provideCompletionItems: (model: ILiquidModel, position) => {
            if (!isInsideLiquidExpression(model, position)) {
                return { suggestions: [] }
            }

            const suggestions = [
                ...getKeywordSuggestions(monaco, position),
                ...getSchemaSuggestions(monaco, model, position, model.schemas),
            ]
            return { suggestions }
        },
    })
    // monaco.languages.registerCompletionItemProvider('yaml', {
    //     provideCompletionItems: (model, position) => {
    //         // Optional: only provide suggestions if inside a meta block
    //         if (!model.uri.path.endsWith('.liquid')) return { suggestions: [] }
    //         const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column)
    //         const suggestions: monacoImport.languages.CompletionItem[] = [
    //             {
    //                 label: 'title',
    //                 kind: monaco.languages.CompletionItemKind.Property,
    //                 insertText: 'title: ',
    //                 range
    //             },
    //             {
    //                 label: 'published',
    //                 kind: monaco.languages.CompletionItemKind.Property,
    //                 insertText: 'published: true',
    //                 range
    //             },
    //             {
    //                 label: 'tags',
    //                 kind: monaco.languages.CompletionItemKind.Property,
    //                 insertText: 'tags:\n  - ',
    //                 range
    //             },
    //         ]

    //         return { suggestions }
    //     },
    // })

}

function getTypeInfoFromSchema(schema: $ZodType, path: Array<string>): string | null {
    let currentSchema = schema

    for (const segment of path) {
        if (currentSchema instanceof ZodArray) {
            currentSchema = currentSchema.element
        }

        if (/^\d+$/.test(segment)) {
            // Skip array indices
        } else if (currentSchema instanceof ZodObject) {
            const shape = currentSchema.shape
            if (Object.prototype.hasOwnProperty.call(shape, segment)) {
                currentSchema = shape[segment]
            } else {
                return null
            }
        } else {
            return null
        }
    }

    if (currentSchema instanceof ZodArray) {
        return 'Array'
    } else if (currentSchema instanceof ZodObject) {
        return 'Object'
    } else if (currentSchema instanceof ZodString) {
        return 'String'
    } else if (currentSchema instanceof ZodNumber) {
        return 'Number'
    } else if (currentSchema instanceof ZodBoolean) {
        return 'Boolean'
    } else {
        return 'Unknown'
    }
}

export const setModelLiquidValidation = (
    monacoInstance: typeof monacoImport,
    model: monacoImport.editor.ITextModel,
    schemas: Record<string, ZodType>,
) => {
    ; (<ILiquidModel>model).schemas = schemas
    validateLiquidSyntax(monacoInstance, model)
    model.onDidChangeContent(() => {
        validateLiquidSyntax(monacoInstance, model)
    })
}

function isInsideLiquidExpression(model: monacoImport.editor.ITextModel, position: monacoImport.Position): boolean {
    const lineContent = model.getLineContent(position.lineNumber)
    const textUntilPos = lineContent.substring(0, position.column - 1)

    // Find the last opening tag before cursor
    const lastOpen = Math.max(
        textUntilPos.lastIndexOf('{{'),
        textUntilPos.lastIndexOf('{%'),
    )
    if (lastOpen === -1) return false

    // Find the nearest closing tag *after* the opening
    const closeCandidates = [
        lineContent.indexOf('}}', lastOpen),
        lineContent.indexOf('%}', lastOpen),
    ].filter(idx => idx !== -1)

    const nearestClose = closeCandidates.length > 0 ? Math.min(...closeCandidates) : -1

    // Cursor is inside if it's after the opening and before the closing
    if (nearestClose !== -1) {
        return position.column - 1 > lastOpen && position.column - 1 <= nearestClose
    }

    // If there's no closing yet, assume we're inside an unclosed expression
    return position.column - 1 > lastOpen
}

function getKeywordSuggestions(monacoInstance: typeof monacoImport, position: monacoImport.Position): Array<monacoImport.languages.CompletionItem> {
    const keywords: Array<string> = [
        'assign', 'capture', 'endcapture', 'increment', 'decrement', 'if', 'endif', 'unless', 'endunless', 'case', 'endcase', 'when', 'else', 'elsif', 'for', 'endfor', 'include', 'with', 'break', 'continue', 'cycle', 'in', 'limit', 'offset', 'render', 'tablerow', 'endtablerow', 'comment', 'endcomment', 'raw', 'endraw', 'paginate', 'endpaginate', 'form', 'endform'
    ]

    const range = new monacoInstance.Range(position.lineNumber, position.column, position.lineNumber, position.column)

    return keywords.map((keyword) => ({
        label: keyword,
        kind: monacoInstance.languages.CompletionItemKind.Keyword,
        insertText: keyword,
        range,
        sortText: `2${keyword}`, // Sort keywords after variables and properties
    }))
}

function getVariablePathAtPosition(model: monacoImport.editor.ITextModel, position: monacoImport.Position): string | null {
    const lineContent = model.getLineContent(position.lineNumber)
    const textUntilPosition = lineContent.substring(0, position.column - 1)

    // Must be after an opening {{
    const lastOpen = textUntilPosition.lastIndexOf('{{')
    if (lastOpen === -1) return null

    const insideExpr = textUntilPosition.substring(lastOpen + 2)
    const variablePathRegex = /[a-zA-Z_][\w\.\[\]]*$/
    const match = variablePathRegex.exec(insideExpr.trim())
    return match ? match[0] : null
}


function getSchemaSuggestions(
    monacoInstance: typeof monacoImport,
    model: monacoImport.editor.ITextModel,
    position: monacoImport.Position,
    schemas: Record<string, $ZodType>,
): Array<monacoImport.languages.CompletionItem> {
    const wordUntilPosition = model.getWordUntilPosition(position)
    const range = new monacoInstance.Range(
        position.lineNumber,
        wordUntilPosition.startColumn,
        position.lineNumber,
        wordUntilPosition.endColumn,
    )

    const variablePath = getVariablePathAtPosition(model, position)
    if (variablePath) {
        // Split the path by dots, brackets, and filter out empty strings
        const pathSegments = variablePath.split(/\.|\[|\]/).filter((segment) => segment !== '')
        const variableName = pathSegments[0]

        if (Object.prototype.hasOwnProperty.call(schemas, variableName!)) {
            const schema = schemas[variableName!]
            const pathWithoutVariableName = pathSegments.slice(1)
            return getSuggestionsFromSchema(monacoInstance, schema!, pathWithoutVariableName, range)
        }
    } else {
        // If no variable path, suggest top-level schema variables
        return Object.keys(schemas).map((variableName) => ({
            label: variableName,
            kind: monacoInstance.languages.CompletionItemKind.Variable,
            insertText: variableName,
            sortText: `0${variableName}`, // Sort top-level variables first
            range,
        }))
    }

    return []
}

function getSuggestionsFromSchema(
    monacoInstance: typeof monacoImport,
    schema: $ZodType,
    path: Array<string>,
    range: monacoImport.Range,
): Array<monacoImport.languages.CompletionItem> {
    let currentSchema = schema

    for (const segment of path) {
        if (currentSchema instanceof ZodArray) {
            currentSchema = currentSchema.element
        }

        if (/^\d+$/.test(segment)) {
            // Skip array indices
        } else if (currentSchema instanceof ZodObject) {
            const shape = currentSchema.shape
            if (Object.prototype.hasOwnProperty.call(shape, segment)) {
                currentSchema = shape[segment]
            } else {
                return []
            }
        } else {
            return []
        }
    }

    if (currentSchema instanceof ZodArray) {
        currentSchema = currentSchema.element
    }

    if (currentSchema instanceof ZodObject) {
        const suggestions: Array<monacoImport.languages.CompletionItem> = []
        const shape = currentSchema.shape
        for (const key in shape) {
            if (Object.prototype.hasOwnProperty.call(shape, key)) {
                const value = shape[key]
                let kind = monacoInstance.languages.CompletionItemKind.Field
                let detail = ''
                let documentation = ''

                if (value instanceof ZodArray) {
                    kind = monacoInstance.languages.CompletionItemKind.Variable
                    detail = 'Array'
                    documentation = 'Type: Array'
                } else if (value instanceof ZodObject) {
                    kind = monacoInstance.languages.CompletionItemKind.Class
                    detail = 'Object'
                    documentation = 'Type: Object'
                } else if (value instanceof ZodString) {
                    kind = monacoInstance.languages.CompletionItemKind.Property
                    detail = 'String'
                    documentation = 'Type: String'
                } else if (value instanceof ZodNumber) {
                    kind = monacoInstance.languages.CompletionItemKind.Property
                    detail = 'Number'
                    documentation = 'Type: Number'
                } else if (value instanceof ZodBoolean) {
                    kind = monacoInstance.languages.CompletionItemKind.Property
                    detail = 'Boolean'
                    documentation = 'Type: Boolean'
                } else {
                    kind = monacoInstance.languages.CompletionItemKind.Property
                    detail = 'Unknown'
                    documentation = 'Type: Unknown'
                }

                suggestions.push({
                    label: key,
                    kind,
                    insertText: key,
                    detail,
                    documentation,
                    range,
                    sortText: `1${key}`, // Sort properties after variables
                })
            }
        }
        return suggestions
    }

    return []
}

function validateLiquidSyntax(monacoInstance: typeof monacoImport, model: monacoImport.editor.ITextModel) {
    const text = model.getValue()
    const lines = text.split(/\r?\n/)

    const markers: Array<monacoImport.editor.IMarkerData> = []
    const stack: Array<{ tag: string; lineNumber: number; column: number }> = []

    const tagRegex = /\{%-?\s*(?!end)(\w+)(?:[\s\S]*?)-?%\}/g
    const endTagRegex = /\{%-?\s*end(\w+)[\s\S]*?-?%\}/g

    const outputStartRegex = /\{\{-?/g   // {{ or {{-
    const outputEndRegex = /-?\}\}/g     // }} or -}}


    lines.forEach((lineContent, index) => {
        const lineNumber = index + 1

        tagRegex.lastIndex = 0
        endTagRegex.lastIndex = 0
        outputStartRegex.lastIndex = 0
        outputEndRegex.lastIndex = 0

        let match: RegExpExecArray | null

        const outputMatches: Array<{ type: 'start' | 'end'; index: number }> = []

        match = outputStartRegex.exec(lineContent)
        while (match !== null) {
            outputMatches.push({ type: 'start', index: match.index })
            match = outputStartRegex.exec(lineContent)
        }

        match = outputEndRegex.exec(lineContent)
        while (match !== null) {
            outputMatches.push({ type: 'end', index: match.index })
            match = outputEndRegex.exec(lineContent)
        }

        outputMatches.sort((a, b) => a.index - b.index)
        outputMatches.forEach((outputMatch) => {
            if (outputMatch.type === 'start') {
                stack.push({ tag: 'output', lineNumber, column: outputMatch.index + 1 })
            } else {
                // outputMatch.type === 'end'
                let last: typeof stack[number] | undefined
                while (stack.length > 0) {
                    last = stack.pop()
                    if (last?.tag === 'output') {
                        break
                    }
                }
                if (!last || last.tag !== 'output') {
                    // Unmatched closing output tag
                    markers.push({
                        severity: monacoInstance.MarkerSeverity.Error,
                        message: `Unmatched closing '}}'`,
                        startLineNumber: lineNumber,
                        startColumn: outputMatch.index + 1,
                        endLineNumber: lineNumber,
                        endColumn: outputMatch.index + 3,
                    })
                }
            }
        })

        match = tagRegex.exec(lineContent)
        while (match !== null) {
            const tag = match[1]!
            const position = match.index

            // Exclude end tags from opening tag regex matches
            if (!tag.startsWith('end') && isBlockTag(tag)) {
                stack.push({ tag, lineNumber, column: position + 1 })
            }

            match = tagRegex.exec(lineContent)
        }

        match = endTagRegex.exec(lineContent)
        while (match !== null) {
            const endTag = match[1]
            const position = match.index

            if (stack.length === 0) {
                // Unmatched end tag
                markers.push({
                    severity: monacoInstance.MarkerSeverity.Error,
                    message: `Unmatched end tag 'end${endTag}'`,
                    startLineNumber: lineNumber,
                    startColumn: position + 1,
                    endLineNumber: lineNumber,
                    endColumn: position + match[0].length + 1,
                })
            } else {
                const last = stack.pop()
                if (last?.tag !== endTag) {
                    // Mismatched end tag
                    markers.push({
                        severity: monacoInstance.MarkerSeverity.Error,
                        message: `Expected 'end${last?.tag}' but found 'end${endTag}'`,
                        startLineNumber: lineNumber,
                        startColumn: position + 1,
                        endLineNumber: lineNumber,
                        endColumn: position + match[0].length + 1,
                    })
                }
            }

            match = endTagRegex.exec(lineContent)
        }
    })

    while (stack.length > 0) {
        const unmatchedTag = stack.pop()
        let message = ''
        if (unmatchedTag?.tag === 'output') {
            message = `Unclosed output tag '{{'`
        } else {
            message = `Unclosed tag '${unmatchedTag?.tag}'`
        }
        markers.push({
            severity: monacoInstance.MarkerSeverity.Error,
            message,
            startLineNumber: unmatchedTag?.lineNumber || 1,
            startColumn: unmatchedTag?.column || 1,
            endLineNumber: unmatchedTag?.lineNumber || 1,
            endColumn: unmatchedTag?.column || 1,
        })
    }
    // monacoInstance.editor.setModelMarkers(model, 'liquid', markers)
}

const blockTags: Array<string> = [
    'if',
    'unless',
    'case',
    'for',
    'tablerow',
    'comment',
    'raw',
    'capture',
    'form',
    'paginate',
    'layout',
    'block',
    'schema',
    'stylesheet',
    'javascript',
]

function isBlockTag(tag: string): boolean {
    return blockTags.includes(tag)
}
