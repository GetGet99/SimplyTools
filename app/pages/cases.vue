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
    <Feature category="none" tool="Cases" class="flex flex-col caseRoot sm:justify-center sm:items-center gap-2">
        <TextBox ref="tb" v-model="text" multiline placeholder="Type here and click the buttons below!" />
        <div class="grid cases gap-2">
            <Button @click="text = cases.lowercase(text)">lowercase</Button>
            <Button @click="text = cases.uppercase(text)">UPPERCASE</Button>
            <Button @click="text = cases.swappingcase(text)">swappingCASE</Button>
            <Button @click="text = cases.randomcase(text)">rANdOmcAse</Button>
            <Button @click="copy" class="p-button-icon flex gap-1 sm:block justify-center" title="Copy">
                <Icon alt="" :icon=CopyIcon />
                <span class="sm:hidden">Copy</span>
            </Button>
        </div>
        <template #summary>
            Convert text to UPPERCASE, lowercase, swap case, or random case instantly.
        </template>

        <template #details>
            <p>
                This text case converter lets you quickly change the capitalization of any text without extra effort.
                Paste or type your text into the box, then choose one of the available transformations:
            </p>
            <ul>
                <li><strong>UPPERCASE</strong> – make all letters capitalized.</li>
                <li><strong>lowercase</strong> – convert all letters to lowercase.</li>
                <li><strong>swappingCASE</strong> – flip the case of each character individually.</li>
                <li><strong>rANdOmcAse</strong> – randomize the case of every letter for fun or stylistic text.</li>
            </ul>
            <p>
                This is useful for editing documents, preparing social media posts, or experimenting with different text styles.
            </p>
        </template>
    </Feature>
</template>
<style lang="css" scoped>
    @reference '../app.css';

    .cases {
        grid-template-rows: repeat(5, minmax(0, 1fr));

        @variant sm {
            grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
        }
    }


    textarea {
        @apply w-full sm:w-[50vw];
    }
</style>