<template>
    <NavigationTabs v-model="lang" :options="['yaml', 'json']" v-slot="{ option }">
        <span v-if="option === 'yaml'">YAML</span>
        <span v-else-if="option === 'json'">JSON</span>
    </NavigationTabs>
    <CodeEditor :lang v-model="code" class="h-30 lg:h-60" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import * as YAML from 'yaml';
const lang = ref<'json' | 'yaml'>('yaml');
const code = ref('');
const model = defineModel<any>();
let parsedModel: any = null;
watch(code, (newCode) => {
    try {
        if (lang.value === 'yaml') {
            model.value = parsedModel = YAML.parse(newCode);
        } else {
            model.value = parsedModel = JSON.parse(newCode);
        }
    } catch (e) {

    }
});
watch(model, (newModel, oldModel) => {
    if (deepEqual(toRaw(newModel), parsedModel) || deepEqual(toRaw(newModel), oldModel)) {
        // do not update if no changes
        return;
    }
    try {
        if (lang.value === 'yaml') {
            code.value = YAML.stringify(newModel);
        } else {
            code.value = JSON.stringify(newModel, null, 4);
        }
    } catch (e) {

    }
}, { immediate: true });
watch(lang, (newLang) => {
    try {
        if (newLang === 'yaml') {
            code.value = YAML.stringify(model.value);
        } else {
            code.value = JSON.stringify(model.value, null, 4);
        }
    } catch (e) {

    }
});
function deepEqual(a: any, b: any): boolean {
    if (a === b) {
        return true;
    }

    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
        return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
            return false;
        }
    }

    return true;
}
</script>