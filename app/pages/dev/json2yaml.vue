<template>
    <Feature class="flex flex-col h-full">
        <Grid :columns="2" rows="auto grow" class="grow">
            <div>JSON</div>
            <div>YAML</div>
            <CodeEditor lang="json" v-model="input" />
            <CodeEditor :lang="output.result === 'ok' ? 'yaml' : 'plaintext'" readonly :model-value="output.yaml ?? output.message" />
        </Grid>
    </Feature>
</template>
<script setup lang="ts">
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