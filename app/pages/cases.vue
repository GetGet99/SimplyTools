<script setup lang="ts">
    import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
    const text = ref('')
    const tb = useTemplateRef('tb')
    function copy() {
        (tb.value! as any as HTMLInputElement).focus();
        (tb.value! as any as HTMLInputElement).select();
        document.execCommand('copy')
    }
</script>
<template>
    <Feature tool="Cases" class="flex flex-col caseRoot sm:justify-center sm:items-center gap-2">
        <TextBox ref="tb" v-model="text" multiline placeholder="Type here and click the buttons below!" />
        <div class="grid gap-2">
            <Button @click="text = cases.lowercase(text)">lowercase</Button>
            <Button @click="text = cases.uppercase(text)">UPPERCASE</Button>
            <Button @click="text = cases.swappingcase(text)">swappingCASE</Button>
            <Button @click="text = cases.randomcase(text)">rANdOmcAse</Button>
            <Button @click="copy" class="p-button-icon flex gap-1 sm:block justify-center" title="Copy">
                <Icon alt="" :icon=CopyIcon />
                <span class="sm:hidden">Copy</span>
            </Button>
        </div>
    </Feature>
</template>
<style lang="css" scoped>
    @reference '../app.css';

    .grid {
        grid-template-rows: repeat(5, minmax(0, 1fr));

        @variant sm {
            grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
        }
    }


    textarea {
        @apply w-full sm:w-[50vw];
    }
</style>