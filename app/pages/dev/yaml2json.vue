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
    </Feature>
</template>
<script setup lang="ts">
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