<script setup lang="ts">
    defineProps<{ placeholder?: string, multiline?: boolean, readonly?: boolean }>()
    const inputRef = useTemplateRef('tb')
    const model = defineModel<string>()
    const r = ref<HTMLTextAreaElement | HTMLInputElement | null>()
    watch(() => inputRef.value, () => r.value = inputRef.value)
    defineExpose(r)
</script>
<template>
    <input v-if="!multiline" ref="tb" type="text" v-model="model" :placeholder autocomplete="off" :readonly v-bind="$attrs" />
    <textarea v-else ref="tb" type="text" v-model="model" :placeholder autocomplete="off" :readonly class="h-60"  v-bind="$attrs"></textarea>
</template>
<style lang="css" scoped>
    @reference '../app.css';

    input, textarea {
        @apply outline-0 border px-2.25 pt-1 pb-0.75 rounded-control;
        @apply border-border-control-primary;
        /* @apply border control-border-control focus:control-border-control-pressed; */
        @apply bg-control-primary hover:bg-control-secondary focus:bg-transparent;
        @apply border-b-2 border-b-control-strong focus:border-b-textbox-accent-highlight;
    }
</style>