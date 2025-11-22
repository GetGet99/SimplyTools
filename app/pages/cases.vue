<template>
    <Feature category="none" tool="Cases" app="do-not-center" class="h-full grid">
        <TextBoxTools class="m-4 mb-4">
            <TextBox ref="tbref" v-model="text" multiline placeholder="Type here and click the buttons above!" />
            <template #tools>
                <Button variant="ghost" class="border-0 flex gap-1 justify-center" @click="apply(lowercase)"
                    title="lowercase">
                    <IconTextCaseLowercase />
                    <span>lowercase</span>
                </Button>
                <Button variant="ghost" class="border-0 flex gap-1 justify-center" @click="apply(uppercase)"
                    title="UPPERCASE">
                    <IconTextCaseUppercase />
                    <span>UPPERCASE</span>
                </Button>
                <Button variant="ghost" class="border-0 flex gap-1 justify-center" @click="apply(swappingcase)"
                    title="swappingCASE">
                    <IconTextChangeCase />
                    <span>swappingCASE</span>
                </Button>
                <Button variant="ghost" class="border-0 flex gap-1 justify-center" @click="apply(randomcase)"
                    title="rANdOmcAse">
                    <div class="w-6 h-6">rA</div>
                    <span>rANdOmcAse</span>
                </Button>
                <Grow />
                <Button variant="ghost" class="border-0 pr-[11px] flex gap-1 justify-center" @click="copy" title="Copy">
                    <IconCopy />
                    <span>Copy</span>
                </Button>
            </template>
        </TextBoxTools>
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
<script setup lang="ts">
setPageInfo(Uncategorized.pages.find(x => x.path === 'cases'))

const text = ref('')
function copy() {
    navigator.clipboard.writeText(text.value)
}
function apply(fn: (x: string) => string) {
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
/** 
 * @param {string} input Input String
 * @returns {string} An output string of all uppercase.
 */
function uppercase(input: string): string {
    return input.toUpperCase()
}
/** 
 * @param {string} input Input String
 * @returns {string} An output string of all lowercase.
 */
function lowercase(input: string): string {
    return input.toLowerCase()
}
/** 
 * @param {string} input Input String
 * @returns {string} An output string with cases swapped
 */
function swappingcase(input: string): string {
    const A = 0x41, Z = 0x5A, a = 0x61, z = 0x7a;
    let output = ""
    for (let i = 0; i < input.length; i++) {
        let code = input.charCodeAt(i);
        if ((code >= A && code <= Z) || (code >= a && code <= z)) {
            if (code >= A && code <= Z) {
                code += a - A
                output += String.fromCharCode(code)
            } else {
                code -= a - A
                output += String.fromCharCode(code)
            }
        } else {
            output += input.charAt(i)
        }
    }
    return output
}
/** 
 * @param {string} input Input String
 * @returns {string} An output string.
 * For each character, it has a probably of 1/2 of swap cases if they are [A-Za-z].
 * This method has no defined behavior for input strings with unicode characters that
 * may span multiple characters.
 */
function randomcase(input: string): string {
    const A = 0x41, Z = 0x5A, a = 0x61, z = 0x7a;
    let output = ""
    for (let i = 0; i < input.length; i++) {
        let code = input.charCodeAt(i);
        if ((code >= A && code <= Z) || (code >= a && code <= z)) {
            if (Math.random() >= 0.5) {
                if (code >= A && code <= Z) {
                    code += a - A
                    output += String.fromCharCode(code)
                } else {
                    code -= a - A
                    output += String.fromCharCode(code)
                }
            } else {
                output += input.charAt(i)
            }
        } else {
            output += input.charAt(i)
        }
    }
    return output
}
</script>