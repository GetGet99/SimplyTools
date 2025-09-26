<!-- editor.client.vue -->
<template>
    <div ref="editorElement" class="overflow-hidden">
    </div>
</template>
<script setup lang="ts">
import '@toast-ui/editor/dist/toastui-editor.css';
import './toastui-editor-simplytools.css'
import Editor from '@toast-ui/editor'

const editorElement = useTemplateRef('editorElement')
const model = defineModel<string>()

onMounted(async () => {
    // Currently .client components await for the component to be mounted before rendering it, so have to await nextTick()
    await nextTick()
    const editor = new Editor({
        el: editorElement.value!,
        initialValue: model.value,
        usageStatistics: false,
        height: undefined,
        theme: 'simplytools',
        initialEditType: 'wysiwyg',
        placeholder: 'Start typing...',
        previewStyle: 'vertical',
        events: {
            change: () => {
                model.value = editor.getMarkdown()
            },
            keydown: (_, kb) => {
                if (kb.ctrlKey && kb.code === 'u') {
                    kb.preventDefault()
                    editor.exec('underline')
                }
            }
        },
        // widgetRules: [
        //     {
        //         rule: /__(\S+)__/,
        //         toDOM(text) {
        //             const rule = /__(\S+)__/;
        //             const matched = text.match(rule)!;
        //             const u = document.createElement('u');
        //             u.innerHTML = `<u>${matched[1]}</u>`;
        //             return u;
        //         },
        //     },
        // ],
        // plugins: [
        //     (pc : typeof EditorOptions.plugins) => ({
                
        //     })
        // ]
    });
    underline(editor)
})

function underline(editor: Editor) {
    editor.addCommand("wysiwyg", "underline", function () {
        const selectedText = editor.getSelectedText();
        let sel = editor.getSelection()
        let uuid = crypto.randomUUID().replaceAll('-', '')
        editor.setSelection(sel[1])
        editor.replaceSelection(`ENDUNDERLINE${uuid}`)
        editor.setSelection(sel[0])
        editor.replaceSelection(`STARTUNDERLINE${uuid}`)
        let md = editor.getHTML()
        md = md.replaceAll(`STARTUNDERLINE${uuid}`, `<u>`).replaceAll(`ENDUNDERLINE${uuid}`, `</u>`)
        editor.setHTML(md)
        return true;
    });
    editor.addCommand("markdown", "underline", function () {
        const selectedText = editor.getSelectedText();
        let sel = editor.getSelection()
        editor.setSelection(sel[1])
        editor.replaceSelection('</span>')
        editor.setSelection(sel[0])
        editor.replaceSelection('<span style="text-decoration: underline">')
        return true;
    });
    editor.insertToolbarItem({ groupIndex: 0, itemIndex: 0 }, {
        name: 'underline',
        tooltip: 'Underline',
        command: 'underline',
        text: 'U',
        className: 'toastui-editor-toolbar-icons underline',
        style: { backgroundImage: 'none' }
      });

}
</script>
