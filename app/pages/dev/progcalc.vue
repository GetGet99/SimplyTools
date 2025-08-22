<script setup lang="ts">
    import type { ComponentAttrs, ComponentProps } from 'vue-component-type-helpers'
    import type { Button } from '#components'
    const calc = reactive(new ProgrammerCalculator())
    const calcInput = new CalculatorUIInput(calc)

    function postprocessNumberKey(key: string, base?: bigint): ComponentProps<typeof Button> & ComponentAttrs<typeof Button> {
        if (base === undefined) {
            base = calc.base
        }
        const disabled: ComponentProps<typeof Button> & ComponentAttrs<typeof Button> = { 'varient': 'none', class: 'border-transparent text-disabled', disabled: true }
        if (key === '(' || key === ')')
            return disabled
        let keyAscii = key.charCodeAt(0)
        let keyVal = BigInt(-1)
        if (keyAscii >= 48 && keyAscii <= 57) {
            keyVal = BigInt(keyAscii - 48)
        }
        else if (keyAscii >= 65 && keyAscii <= 70) {
            keyVal = BigInt(keyAscii - 65 + 10)
        }
        else if (keyAscii >= 97 && keyAscii <= 102) {
            keyVal = BigInt(keyAscii - 97 + 10)
        } else {
            return {}
        }
        let className = 'key-number'
        if (keyVal >= 10 && base <= 10n) {
            return disabled
        }
        if (keyVal >= 8 && base <= 8n) {
            return disabled
        }
        if (keyVal >= 2 && base === 2n) {
            return disabled
        }
        return {}
    }
    function keydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
        calcInput.type(e.key)
    }

    function pasteHandler(e: ClipboardEvent) {
        e.preventDefault();

        let text = e.clipboardData?.getData("text") ?? "";
        for (const char of text) {
            if (char === '_') {
                // we ignore that as it will flip the sign
                continue
            }
            calcInput.type(char)
        }
        

    }
    onMounted(() => {
        window.addEventListener('keydown', keydown)
        window.addEventListener('paste', pasteHandler)
    })
    onUnmounted(() => {
        window.removeEventListener('keydown', keydown)
        window.removeEventListener('paste', pasteHandler)
    })
    const display = computed(() => calc.error || calc.displayOf(calc.value))
</script>
<template>
    <Feature category="dev" tool="Programmer Calculator" class="flex justify-center">
        <div class="flex flex-col w-full sm:w-[unset] sm:min-w-100 gap-2 bg-card pt-4 rounded-4">
            <div class="flex flex-col text-right">
                <span class="h2 h-5 text-subtitle uppercase mr-4" v-html="calc.expressionDisplay"></span>
                <div class="h1 uppercase justify-end">
                    <span class="text-right select-text">{{ display }}</span>
                    <div class="w-4 text-body text-left inline-block">
                        <sub>{{ calc.base !== 10n ? calc.base : '' }}</sub>
                    </div>
                </div>
            </div>
            <Button v-if="calc.negativeDisplay === 'signed'" class="bg-transparent border-transparent"
                @click="calc.negativeDisplay = 'complement'">
                Negative Display: NUMBER
            </Button>
            <Button v-else class="bg-transparent border-transparent" @click="calc.negativeDisplay = 'signed'">
                Negative Display: BITS
            </Button>
            <ToggleGroupRoot model-value="base" @update:model-value="x => x && (calc.base = x as typeof calc.base)"
                class="grid grid-rows-4 gap-2 text-sm">
                <ToggleGroupItem as-child v-for="b in ([16n, 10n, 8n, 2n] as SupportedBaseBigInt[])" :value=b>
                    <Button class="baseDisplay bg-transparent border-transparent h-10 flex items-center"
                        :class="calc.base === b ? 'selected' : ''">
                        <span class="label" :class="calc.base === b ? 'selected' : ''">
                            {{ b === 16n ? 'HEX' :
                                (b === 10n ? 'DEC' :
                                    (b === 8n ? 'OCT' :
                                        'BIN')) }}
                        </span>
                        <span class="max-w-75 uppercase text-left" style="line-height: 16px;">{{ calc.format(calc.value,
                            b) }}</span>
                    </Button>
                </ToggleGroupItem>
            </ToggleGroupRoot>
            <div class="flex">
                <!-- <Button class="uppercase w-25 bg-transparent border-transparent" @click="() => {
                    if (signed === 'signed') {
                        signed = 'unsigned'
                    } else {
                        signed = 'signed'
                    }
                }">{{ signed === 'unsigned' ? 'unsigned' : 'signed' }}</Button> -->
                <Button class="uppercase w-25 bg-transparent border-transparent" @click="() => {
                    if (calc.NumType === 'byte') {
                        calc.NumType = 'qword'
                    } else if (calc.NumType === 'qword') {
                        calc.NumType = 'dword'
                    } else if (calc.NumType === 'dword') {
                        calc.NumType = 'word'
                    } else if (calc.NumType === 'word') {
                        calc.NumType = 'byte'
                    }
                }">{{ calc.NumType }}</Button>
                <Button class="w-50 bg-transparent border-transparent" @click="() => {
                    if (calc.shiftMode === 'arith') {
                        calc.shiftMode = 'logical'
                    } else {
                        calc.shiftMode = 'arith'
                    }
                }">Shift mode: {{ calc.shiftMode.toUpperCase() }}</Button>
            </div>
            <div class="grid grid-cols-5 grid-row-6 gap-1 p-2" :data-num="calc.base">
                <Button class="key" v-for="c in ['A', '<<', '>>']" v-bind="postprocessNumberKey(c)"
                    @click="calcInput.type(c)">{{ c }}</Button>
                <Button class="key" @click="calc.clear()">{{ calc.value === 0n ? 'C' : 'CE' }}</Button>
                <Button class="key" @click="calc.backspace()">DEL</Button>
                <Button class="key" v-for="c in ['B', '(', ')', '%', '÷']" v-bind="postprocessNumberKey(c)"
                    @click="calcInput.type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['C', '7', '8', '9', '×']" v-bind="postprocessNumberKey(c)"
                    @click="calcInput.type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['D', '4', '5', '6', '-']" v-bind="postprocessNumberKey(c)"
                    @click="calcInput.type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['E', '1', '2', '3', '+']" v-bind="postprocessNumberKey(c)"
                    @click="calcInput.type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['F', '+/-', '0']" v-bind="postprocessNumberKey(c)"
                    @click="calcInput.type(c)">{{ c }}</Button>
                <Button varient="none" class="key border-transparent text-disabled" disabled>.</Button>
                <Button class="key rounded-br-[calc(2_*_0.25rem)]" varient="accent" @click="calcInput.type('=')">{{ "="
                }}</Button>
            </div>
        </div>

        <template #summary>
            Convert numbers between decimal, hexadecimal, binary, and octal, with support for bit shifts up to 64-bits.
        </template>

        <template #details>
            <p>
                This calculator lets you work across multiple number systems — base 10 (decimal), base 16 (hexadecimal),
                base 8 (octal), and base 2 (binary). It’s designed for quick conversions and bit-level operations.
            </p>
            <ul>
                <li>Switch between <strong>logical</strong> and <strong>arithmetic</strong> bit shifts with the
                    “Bit Shifts” toggle.</li>
                <li>Choose how negative numbers appear: as raw two’s complement bits (e.g., <code>FFFF FF85</code>) or
                    as the signed value (e.g., <code>-7B</code>).</li>
                <li>Handle values up to <strong>64 bits</strong>, with support for QWORD (64-bit), DWORD (32-bit),
                    WORD (16-bit), and BYTE (8-bit) modes.</li>
            </ul>
            <p>
                ⚠️ Note: numbers can overflow depending on the selected size. This tool simulates real overflow
                behavior,
                so results match what you’d see in actual computation.
            </p>
        </template>
    </Feature>
</template>
<style lang="css" scoped>
    @reference '../../app.css';

    [data-keyboardfocus="hidden"],
    [data-keyboardfocus="hidden"] * {
        outline: none;
    }

    .baseDisplay {
        @apply grid gap-2 relative;
        grid-template-columns: auto auto minmax(0, 1fr);
    }

    .baseDisplay.selected {
        @apply bg-control-primary;
    }

    .label {
        @apply px-2 w-10;
    }

    .label.selected::before {
        @apply absolute top-1/2 left-1 -translate-y-1/2 w-1 h-5 rounded-full bg-accent-primary;
        content: "";
    }
</style>