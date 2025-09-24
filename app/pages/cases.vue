<script setup lang="ts">
import { Uncategorized } from '~/utils/pages/uncategorized'
usePageInfo(Uncategorized.pages.find(x => x.path === 'cases'))
import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
import Lowercase from '@fluentui/svg-icons/icons/text_case_lowercase_24_regular.svg?raw'
import Uppercase from '@fluentui/svg-icons/icons/text_case_uppercase_24_regular.svg?raw'
import Swappingcase from '@fluentui/svg-icons/icons/text_change_case_24_regular.svg?raw'

const text = ref('')
function copy() {
    navigator.clipboard.writeText(text.value)
}
function apply(fn : (x: string) => string) {
    const tb = tbref.value
    if (!tb) return
    let sel = tb.getSelectionText()
    if (!sel) {
        text.value = fn(text.value)
        return
    }
    tb.setSelectionText(fn(tb.getSelectionText()))
}
const tbref = useTemplateRef('tbref')
</script>
<template>
    <Feature category="none" tool="Cases" app="do-not-center" class="h-full grid">
        <TextBoxTools class="m-4 mb-4">
            <TextBox ref="tbref" v-model="text" multiline placeholder="Type here and click the buttons above!" />
            <template #tools>
                <Button class="bg-transparent border-0 p-button-icon flex gap-1 justify-center" @click="apply(cases.lowercase)"
                    title="lowercase">
                    <Icon alt="" :icon=Lowercase />
                    <span>lowercase</span>
                </Button>
                <Button class="bg-transparent border-0 p-button-icon flex gap-1 justify-center" @click="apply(cases.uppercase)"
                    title="UPPERCASE">
                    <Icon alt="" :icon=Uppercase />
                    <span>UPPERCASE</span>
                </Button>
                <Button class="bg-transparent border-0 p-button-icon flex gap-1 justify-center" @click="apply(cases.swappingcase)"
                    title="swappingCASE">
                    <Icon alt="" :icon=Swappingcase />
                    <span>swappingCASE</span>
                </Button>
                <Button class="bg-transparent border-0 p-button-icon flex gap-1 justify-center" @click="apply(cases.randomcase)"
                    title="rANdOmcAse">
                    <div class="w-6 h-6">rA</div>
                    <span>rANdOmcAse</span>
                </Button>
                <Grow />
                <Button class="bg-transparent border-0 p-button-icon pr-[11px] flex gap-1 justify-center" @click="copy"
                    title="Copy">
                    <Icon alt="" :icon=CopyIcon />
                    <span>Copy</span>
                </Button>
            </template>
        </TextBoxTools>
        <!-- <Grid class="cases gap-2">
            <Button @click="text = cases.lowercase(text)">lowercase</Button>
            <Button @click="text = cases.uppercase(text)">UPPERCASE</Button>
            <Button @click="text = cases.swappingcase(text)">swappingCASE</Button>
            <Button @click="text = cases.randomcase(text)">rANdOmcAse</Button>
            <Button @click="copy" class="p-button-icon flex gap-1 sm:block justify-center" title="Copy">
                <Icon alt="" :icon=CopyIcon />
                <span class="sm:hidden">Copy</span>
            </Button>
        </Grid> -->
        <template #summary>
            Convert text to UPPERCASE, lowercase, swap case, or random case instantly.
        </template>

        <template #details>
            <p>
                This text case converter lets you quickly change the capitalization of any text without extra effort.
                Paste or type your text into the box, then choose one of the available transformations:
            </p>
            <ul>
                <li>AA <strong>UPPERCASE</strong> – make all letters capitalized.</li>
                <li>aa <strong>lowercase</strong> – convert all letters to lowercase.</li>
                <li>sC <strong>swappingCASE</strong> – flip the case of each character individually.</li>
                <li>rA<strong>rANdOmcAse</strong> – randomize the case of every letter for fun or stylistic text.</li>
            </ul>
            <p>
                This is useful for editing documents, preparing social media posts, or experimenting with different text
                styles.
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


/* textarea {
    @apply w-full sm:w-[50vw];
} */
</style>