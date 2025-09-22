import type * as monacoImport from 'monaco-editor'
export async function useMonacoWithOurTheme() {
    if (import.meta.client) {
        const monaco = await useMonaco()
        const transparent = '#00000000'
        monaco.editor.defineTheme('simplytools-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': transparent,
                focusBorder: transparent,
                "widget.shadow": transparent,
                "editorStickyScrollHover.background": transparent,
            }
        })
        monaco.editor.defineTheme('simplytools-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': transparent,
                focusBorder: transparent,
                "widget.shadow": transparent,
                "editorStickyScrollHover.background": transparent,
            }
        })
        monaco.editor.addKeybindingRules([
            {
                // disable show command center
                keybinding: monaco.KeyCode.F1,
                command: null,
            },
            {
                // disable show error command
                keybinding: monaco.KeyCode.F8,
                command: null,
            },
            {
                // disable toggle debugger breakpoint
                keybinding: monaco.KeyCode.F9,
                command: null,
            },
        ]);

        monaco.editor.addKeybindingRule({
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Shift | monaco.KeyCode.KeyP,
            command: 'editor.action.quickCommand',
            when: "textInputFocus"
        })

        // Bold: Ctrl/Cmd + B
        addMarkdownAction(monaco, {
            id: "markdown.bold",
            label: "Markdown: Bold",
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB,
            wrapper: "**"
        });

        // Italic: Ctrl/Cmd + I
        addMarkdownAction(monaco, {
            id: "markdown.italic",
            label: "Markdown: Italic",
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI,
            wrapper: "*"
        });

        // Underline (custom for our SimplyNotes): Ctrl/Cmd + U
        addMarkdownAction(monaco, {
            id: "markdown.underline",
            label: "Markdown: Underline",
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU,
            wrapper: "__"
        });

        // Inline code: Ctrl/Cmd + E
        addMarkdownAction(monaco, {
            id: "markdown.code",
            label: "Markdown: Inline Code",
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE,
            wrapper: "`"
        });

        // Strikethrough: Ctrl/Cmd + Shift + X
        addMarkdownAction(monaco, {
            id: "markdown.strikethrough",
            label: "Markdown: Strikethrough",
            keybinding:
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyX,
            wrapper: "~~"
        });

        for (let i = 1; i <= 6; i++)
            // Heading: Ctrl/Cmd + H
            addMarkdownPrefixAction(monaco, {
                id: `markdown.heading.${i}`,
                label: `Markdown: Heading ${i}`,
                keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | (monaco.KeyCode.Numpad0 + i),
                prefix: "#"
            });

        // Blockquote: Ctrl/Cmd + Shift + Q
        addMarkdownPrefixAction(monaco, {
            id: "markdown.quote",
            label: "Markdown: Blockquote",
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyQ,
            prefix: ">"
        });


        // Increase heading level
        addMarkdownHeadingAction(monaco, {
            id: "markdown.heading.up",
            label: "Markdown: Increase Heading Level",
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyH,
            direction: "up"
        });

        // Decrease heading level
        addMarkdownHeadingAction(monaco, {
            id: "markdown.heading.down",
            label: "Markdown: Decrease Heading Level",
            keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyH,
            direction: "down"
        });


        return monaco
    }
    return null
}
function addMarkdownAction(monaco: typeof monacoImport, { id, label, keybinding, wrapper }: {
    id: string,
    label: string,
    keybinding: number,
    wrapper: string
}) {
    monaco.editor.addEditorAction({
        id,
        label,
        keybindings: [keybinding],
        precondition: "editorLangId == 'markdown'",
        run: (editor) => {
            const selection = editor.getSelection()!;
            const model = editor.getModel()!;
            const text = model.getValueInRange(selection);

            let newText, newSelection;

            if (text) {
                const startsWith = text.startsWith(wrapper);
                const endsWith = text.endsWith(wrapper);

                if (startsWith && endsWith) {
                    // ✅ Toggle off → remove wrapper
                    newText = text.slice(wrapper.length, text.length - wrapper.length);
                } else {
                    // ✅ Toggle on → add wrapper
                    newText = `${wrapper}${text}${wrapper}`;
                }

                editor.executeEdits(id, [
                    { range: selection, text: newText, forceMoveMarkers: true }
                ]);

                newSelection = new monaco.Selection(
                    selection.startLineNumber,
                    selection.startColumn,
                    selection.endLineNumber,
                    selection.startColumn + newText.length
                );
                editor.setSelection(newSelection);
            } else {
                // No text selected → insert wrapper pair, place cursor inside
                const pos = selection.getStartPosition();
                const insertText = `${wrapper}${wrapper}`;
                editor.executeEdits(id, [
                    { range: selection, text: insertText, forceMoveMarkers: true }
                ]);

                newSelection = new monaco.Selection(
                    pos.lineNumber,
                    pos.column + wrapper.length,
                    pos.lineNumber,
                    pos.column + wrapper.length
                );
                editor.setSelection(newSelection);
            }
        }
    });
}
function addMarkdownPrefixAction(monaco: typeof monacoImport, { id, label, keybinding, prefix }: {
    id: string,
    label: string,
    keybinding: number,
    prefix: string
}) {
    monaco.editor.addEditorAction({
        id,
        label,
        keybindings: [keybinding],
        precondition: "editorLangId == 'markdown'",
        run: (editor) => {
            const selection = editor.getSelection()!;
            const model = editor.getModel()!;

            const startLine = selection.startLineNumber;
            const endLine = selection.endLineNumber;

            const edits = [];
            for (let line = startLine; line <= endLine; line++) {
                const lineContent = model.getLineContent(line);
                if (lineContent.startsWith(prefix + " ")) {
                    // ✅ Toggle off → remove prefix
                    edits.push({
                        range: new monaco.Range(line, 1, line, prefix.length + 2),
                        text: "",
                        forceMoveMarkers: true,
                    });
                } else {
                    // ✅ Toggle on → add prefix
                    edits.push({
                        range: new monaco.Range(line, 1, line, 1),
                        text: prefix + " ",
                        forceMoveMarkers: true,
                    });
                }
            }

            editor.executeEdits(id, edits);

            // Preserve selection after edit
            editor.setSelection(
                new monaco.Selection(
                    startLine,
                    selection.startColumn + prefix.length + 1,
                    endLine,
                    selection.endColumn + prefix.length + 1
                )
            );
        },
    });
}
function addMarkdownHeadingAction(monaco: typeof monacoImport, { id, label, keybinding, direction }: {
    id: string,
    label: string,
    keybinding: number,
    direction: 'up' | 'down'
}) {
    monaco.editor.addEditorAction({
        id,
        label,
        keybindings: [keybinding],
        precondition: "editorLangId == 'markdown'",
        run: (editor) => {
            const selection = editor.getSelection()!;
            const model = editor.getModel()!;
            const startLine = selection.startLineNumber;
            const endLine = selection.endLineNumber;

            const edits = [];
            for (let line = startLine; line <= endLine; line++) {
                let lineContent = model.getLineContent(line).trimStart();

                const headingMatch = lineContent.match(/^(#{1,6})\s+(.*)$/);
                if (headingMatch) {
                    let level = headingMatch[1]!.length;
                    const text = headingMatch[2]!;

                    if (direction === "up" && level < 6) level++;
                    else if (direction === "down" && level > 1) level--;
                    else if (direction === "down" && level === 1) {
                        // remove heading
                        edits.push({
                            range: new monaco.Range(line, 1, line, model.getLineMaxColumn(line)),
                            text: text,
                            forceMoveMarkers: true,
                        });
                        continue;
                    }

                    edits.push({
                        range: new monaco.Range(line, 1, line, model.getLineMaxColumn(line)),
                        text: "#".repeat(level) + " " + text,
                        forceMoveMarkers: true,
                    });
                } else {
                    // not a heading → add heading 1 if cycling up
                    if (direction === "up") {
                        edits.push({
                            range: new monaco.Range(line, 1, line, model.getLineMaxColumn(line)),
                            text: "# " + lineContent,
                            forceMoveMarkers: true,
                        });
                    }
                }
            }

            editor.executeEdits(id, edits);
        },
    });
}
