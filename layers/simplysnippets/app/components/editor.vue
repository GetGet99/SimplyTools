<template>
    <CodeEditor ref="editor" lang="liquid" :readonly="props.readonly" v-model="code" />
</template>
<script setup lang="ts">
import * as YAML from "yaml";
import { useMonacoLiquidLanguage, setModelLiquidValidation } from "../lib/liquid/language";
import { extractYamlComment, yamlToZod } from "../lib/metadata";
const props = defineProps<{ readonly?: boolean }>()
const code = defineModel<string>()

const editorRef = useTemplateRef("editor");
const monaco = useMonacoWithOurTheme()
await useMonacoLiquidLanguage();
if (monaco) {
    useMonacoLiquidLanguage();
    watch(code, async (newCode) => {
        if (!newCode) {
            return
        }
        let editor = editorRef?.value?.editor
        if (editor === undefined) {
            return
        }
        const yamlText = extractYamlComment(newCode);
        if (yamlText) {
            try {
                const meta = YAML.parse(yamlText);
                const schemas = yamlToZod(meta);

                const model = editor.getModel();
                if (model) {
                    //@ts-ignore
                    setModelLiquidValidation(monaco, model, schemas);
                }
            } catch (err) {
                // console.error("YAML parse error:", err);
            }
        }
    }, { immediate: true });
}
</script>