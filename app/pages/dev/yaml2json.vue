<template>
    <Feature limit-screen="all">
        <Grid :columns="2" rows="auto grow" class="grow h-full gap-2 p-2">
            <div>YAML</div>
            <div>JSON</div>
            <InputTextBoxTools v-model="input">
                <CodeEditor lang="yaml" v-model="input" />
            </InputTextBoxTools>
            <OutputTextBoxTools :output="output.json ?? output.message"
                :filename-hint="output.result === 'ok' ? 'output.json' : 'error.txt'">
                <CodeEditor :lang="output.result === 'ok' ? 'json' : 'plaintext'" readonly
                    :model-value="output.json ?? output.message" />
            </OutputTextBoxTools>
        </Grid>
        <template #summary>
            Easily convert YAML to JSON format.
        </template>
        <template #details>
            <p>This tool allows you to convert YAML formatted text into JSON format. Simply paste your YAML into the
                left editor, and the corresponding JSON will be generated on the right. If there are any errors in the
                YAML syntax, an error message will be displayed instead.</p>
        </template>
    </Feature>
</template>
<script setup lang="ts">
usePageInfo(DevCategory.pages.find(p => p.path === 'yaml2json')!)
import * as YAML from 'yaml'
const input = ref(`# Put your YAML here
items:
  - name: Example
    value: 42
`)
const output = computed(() => {
    try {
        return {
            result: 'ok',
            json: JSON.stringify(YAML.parse(input.value), null, 2),
        }
    } catch (e: any) {
        return {
            result: 'error',
            message: e.message
        }
    }
})
</script>