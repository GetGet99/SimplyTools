<template>
    <Feature limit-screen="all">
        <Grid :columns="2" rows="auto grow" class="grow h-full gap-2 p-2">
            <div>JSON</div>
            <div>YAML</div>
            <InputTextBoxTools v-model="input">
                <CodeEditor lang="json" v-model="input" />
            </InputTextBoxTools>
            <OutputTextBoxTools :output="output.yaml ?? output.message" :filename-hint="output.result === 'ok' ? 'output.yaml' : 'error.txt'">
                <CodeEditor :lang="output.result === 'ok' ? 'yaml' : 'plaintext'" readonly
                    :model-value="output.yaml ?? output.message" />
            </OutputTextBoxTools>
        </Grid>
        <template #summary>
            Easily convert JSON to YAML format.
        </template>
        <template #details>
            <p>This tool allows you to convert JSON formatted text into YAML format. Simply paste your JSON into the
                left editor, and the corresponding YAML will be generated on the right. If there are any errors in the
                JSON syntax, an error message will be displayed instead.</p>
        </template>
    </Feature>
</template>
<script setup lang="ts">
usePageInfo(DevCategory.pages.find(p => p.path === 'json2yaml')!)
import * as YAML from 'yaml'
const input = ref(`{
    "items": [
        {
            "name": "Example",
            "value": 42
        }
    ]
}`)
const output = computed(() => {
    try {
        return {
            result: 'ok',
            yaml: YAML.stringify(JSON.parse(input.value), null, 2),
        }
    } catch (e: any) {
        return {
            result: 'error',
            message: e.message
        }
    }
})
</script>