<script setup lang="ts">
const props = defineProps<{ placeholder?: string, multiline?: boolean, readonly?: boolean, validate?: (x: string) => boolean, pastePreprocessor?: (x: string) => string }>()
const inputRef = useTemplateRef('tb')
const model = defineModel<string>()
function update() {
    const newText = inputRef.value!.value
    if (newText === model.value) {
        // nothing changed
        return
    }
    if (props.validate && !props.validate(newText)) {
        // error: validation failed
        inputRef.value!.value = model.value ?? ''
    } else {
        model.value = newText
    }
}
function focus() {
    inputRef.value?.focus()
}
function pasteHandler(e: ClipboardEvent) {
    if (props.pastePreprocessor) {
        e.preventDefault();

        let text = e.clipboardData?.getData("text") ?? "";
        text = props.pastePreprocessor(text);

        const input = inputRef.value!;
        const { selectionStart, selectionEnd, value } = input;

        if (selectionStart == null || selectionEnd == null) {
            // fallback if somehow selection isn’t available
            input.value += text;
        } else {
            // splice the preprocessed text into the current value
            input.value =
                value.slice(0, selectionStart) + text + value.slice(selectionEnd);

            // move caret to the end of the inserted text
            const pos = selectionStart + text.length;
            input.setSelectionRange(pos, pos);
        }

        // trigger input event so reactive bindings pick up change
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }
}
defineExpose({ focus })
</script>
<template>
    <input v-if="!multiline" ref="tb" type="text" :value="model" @input="update" :placeholder autocomplete="off"
        :readonly @paste="pasteHandler" class="style-textbox" />
    <textarea v-else ref="tb" :value="model" :placeholder autocomplete="nope" :readonly class="h-60 style-textbox"
        @input="update" @paste="pasteHandler"></textarea>
</template>