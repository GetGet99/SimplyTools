<template>
    <Feature class="flex flex-col h-full">
        <Grid :columns="2" rows="auto grow" class="grow">
            <div>YAML</div>
            <div>JSON</div>
            <CodeEditor lang="yaml" v-model="input" />
            <CodeEditor :lang="output.result === 'ok' ? 'json' : 'plaintext'" readonly :model-value="output.json ?? output.message" />
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