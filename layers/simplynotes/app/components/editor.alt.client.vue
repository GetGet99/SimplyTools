<template>
    <Grid rows="auto grow auto">
        <!-- Toolbar -->
        <Flex>
            <Button class="p-button-icon bg-transparent border-transparent"
                @click="toolbarToggle('markdown.bold', OurSchema.marks.strong)">
                <Icon :icon="BoldIcon" alt="" />
            </Button>
            <Button class="p-button-icon bg-transparent border-transparent"
                @click="toolbarToggle('markdown.italic', OurSchema.marks.em)">
                <Icon :icon="ItalicIcon" alt="" />
            </Button>
            <Button class="p-button-icon bg-transparent border-transparent"
                @click="toolbarToggle('markdown.underline', OurSchema.marks.underline)">
                <Icon :icon="UnderlineIcon" alt="" />
            </Button>
            <Button class="p-button-icon bg-transparent border-transparent"
                @click="toolbarToggle('markdown.strikethrough', OurSchema.marks.strikethrough)">
                <Icon :icon="StrikethroughIcon" alt="" />
            </Button>
            <Button class="p-button-icon bg-transparent border-transparent"
                @click="toolbarBlock('markdown.quote', OurSchema.nodes.blockquote)">
                <Icon :icon="QuoteIcon" alt="" />
            </Button>
            <Button class="p-button-icon bg-transparent border-transparent"
                @click="toolbarBlock('markdown.quote', OurSchema.nodes.blockquote)">
                <Icon :icon="QuoteIcon" alt="" />
            </Button>
            
        </Flex>
        <div class="grid data-[view=markdown]:grid-cols-2 overflow-y-hidden" :data-view="view">
            <div :class="view === 'markdown' ? '' : 'hidden'">
                <CodeEditor ref="editor" lang="markdown" class="h-full" v-model="model" />
            </div>
            <div ref="richEditorDiv" class="overflow-y-scroll"
                :class="view === 'rich' ? 'grid utils-style-textbox-no-hover utils-style-textbox-focus' : 'px-5 py-1'"
                :spellcheck="view === 'rich'">
            </div>
        </div>
        <Flex>
            <div>Footer</div>
            <Grow />
            <NavigationTabs v-model="view" :options="['markdown', 'rich']" />
        </Flex>
    </Grid>
</template>
<script setup lang="ts">
import BoldIcon from '@fluentui/svg-icons/icons/text_bold_24_regular.svg?raw'
import ItalicIcon from '@fluentui/svg-icons/icons/text_italic_24_regular.svg?raw'
import UnderlineIcon from '@fluentui/svg-icons/icons/text_underline_24_regular.svg?raw'
import StrikethroughIcon from '@fluentui/svg-icons/icons/text_strikethrough_24_regular.svg?raw'
import QuoteIcon from '@fluentui/svg-icons/icons/text_quote_24_regular.svg?raw'
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands"
import { EditorView } from "prosemirror-view"
import { EditorState, Plugin } from "prosemirror-state"
import { OurSchema, OurMarkdownParser, OurMarkdownSErializer } from '../lib/markdown'
import 'prosemirror-example-setup/style/style.css'
import { simplyToolsPlugins } from "../lib/plugin"
import type { MarkType, NodeType } from "prosemirror-model"
const view = ref<'markdown' | 'rich'>('markdown')
const model = defineModel<string>()
const editor = useTemplateRef('editor')

const richEditorDiv = useTemplateRef('richEditorDiv')
let richEditor: EditorView | undefined

function toolbarToggle(vscodeAction: string, mark: MarkType) {
    if (view.value === 'markdown') {
        const monacoEditor = editor.value?.editor
        if (!monacoEditor) return
        monacoEditor.focus()
        monacoEditor.getAction(vscodeAction)?.run()
        monacoEditor.trigger('toolbar', vscodeAction, null)
    } else {
        richEditor!.focus(); toggleMark(mark)(richEditor!.state, richEditor!.dispatch, richEditor)
    }
}

function toolbarBlock(vscodeAction: string, node: NodeType) {
    if (view.value === 'markdown') {
        const monacoEditor = editor.value?.editor
        if (!monacoEditor) return
        monacoEditor.focus()
        monacoEditor.getAction(vscodeAction)?.run()
        monacoEditor.trigger('toolbar', vscodeAction, null)
    } else {
        richEditor!.focus(); setBlockType(node)(richEditor!.state, richEditor!.dispatch, richEditor)
    }
}

onMounted(async () => {
    await nextTick()
    richEditor = new EditorView(richEditorDiv.value!, {
        state: EditorState.create({
            doc: OurMarkdownParser.parse(model.value ?? ''),
            plugins: [
                ...simplyToolsPlugins(),
                // readonly when markdown view
                new Plugin({
                    filterTransaction: transaction => {
                        if (view.value === 'markdown')
                            // Allow selections but prevent any other changes
                            return transaction.docChanged === false;
                        // allow otherwise
                        return true
                    },
                }),
            ]
        }),
        plugins: [new Plugin({
            view() {
                return {
                    update() {
                        if (view.value === 'rich')
                            model.value = OurMarkdownSErializer.serialize(richEditor!.state.doc)
                    },
                }
            },
        }),
        ],
    })
})
// watch(view, () => {
//     if (view.value === 'rich' && richEditor) {
//         richEditor.destroy()
//         richEditor = new EditorView(richEditorDiv.value!, {
//             state: EditorState.create({
//                 doc: OurMarkdownParser.parse(model.value ?? '')
//             })
//         })
//     } else if (richEditor) {
//         model.value = OurMarkdownSErializer.serialize(richEditor.state.doc)
//     }
// })
watch(model, () => {
    if (view.value !== 'rich' && richEditor && !richEditor.hasFocus()) {
        const newState = EditorState.create({
            doc: OurMarkdownParser.parse(model.value ?? ''),
            selection: richEditor.state.selection,
            plugins: richEditor.state.plugins,
        });
        richEditor.updateState(newState)
    }
})
</script>
<style lang="css">
@reference '~~/layers/simplytools-ui/app/app.css';

.ProseMirror {
    outline: none;
}

.ProseMirror ul li {
    list-style-position: outside;
}

.ProseMirror {

    & ul,
    & ul ul ul,
    & ul ul ul ul ul,
    & ul ul ul ul ul ul ul {
        list-style: disc;
    }

    & ul ul,
    & ul ul ul ul,
    & ul ul ul ul ul ul,
    & ul ul ul ul ul ul ul ul {
        list-style: circle;
    }
}


.ProseMirror {
    @apply space-y-4;
}

.ProseMirror ol {
    @apply ml-1;
    list-style: decimal;
}

.ProseMirror ol li {
    @apply ml-2;
}

.ProseMirror h1,
.ProseMirror h2 {
    @apply border-b border-b-foreground;
}

.ProseMirror {

    & h1,
    & h2,
    & h3,
    & h4,
    & h5,
    & h6 {
        @apply mt-6;
    }
}
</style>