<template>
    <MonacoEditor ref="editor" lang="liquid" :options="{
        theme: 'simplytools',
        minimap: {
            enabled: false
        },
        readOnly: readonly
    }" v-model="code" class="bg-control-primary" />
</template>
<script setup lang="ts">
    import * as YAML from "yaml";
    import { ref, watch } from "vue";
    // import { registerLiquidLanguage, setModelLiquidValidation } from "monaco-liquid";
    import { registerLiquidLanguage, setModelLiquidValidation } from "~/utils/snippets/liquid/language";
    import { extractYamlComment, yamlToZod } from "~/utils/snippets/metadata";
    const props = defineProps<{ readonly?: boolean }>()
    const code = defineModel<string>()

    const editorRef = useTemplateRef("editor");
    let monaco = await useMonacoWithOurTheme();
    if (monaco) {
        registerLiquidLanguage(monaco);
        watch(code, async (newCode) => {
            if (!newCode) {
                return
            }
            let editor = editorRef?.value?.$editor
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