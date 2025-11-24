<template>
    <Feature limit-screen="all">
        <Grid :columns="2" rows="auto grow" class="grow h-full gap-2 p-2">
            <div>JSON</div>
            <div>Schema</div>
            <InputTextBoxTools v-model="input">
                <CodeEditor lang="json" v-model="input" />
            </InputTextBoxTools>
            <OutputTextBoxTools :output="output.schema ?? output.message" :filename-hint="output.result === 'ok' ? 'output.schema' : 'error.txt'">
                <CodeEditor :lang="output.result === 'ok' ? 'json' : 'plaintext'" readonly
                    :model-value="output.schema ?? output.message" />
            </OutputTextBoxTools>
        </Grid>
        <template #summary>
            Easily convert JSON to Schema format.
        </template>
        <template #details>
            <p>This tool allows you to convert JSON formatted text into Schema format. Simply paste your JSON into the
                left editor, and the corresponding Schema will be generated on the right. If there are any errors in the
                JSON syntax, an error message will be displayed instead.</p>
        </template>
    </Feature>
</template>
<script lang="ts" setup>
const input = defineModel<any>()
const output = computed(() => {
    try {
        return {
            result: 'ok',
            schema: JSON.stringify(generateSchema(JSON.parse(input.value)), null, 2),
        }
    } catch (e: any) {
        return {
            result: 'error',
            message: e.message
        }
    }
})

</script>