<template>
    <Feature category="dev" tool="Programmer Calculator" class="flex justify-center">
        <Flex column class="w-full sm:w-[unset] sm:min-w-100 gap-2 bg-card pt-4 rounded-4">
            <Flex column class="text-right">
                <span class="h2 h-5 text-subtitle uppercase mr-4" v-html="calc.expressionDisplay"></span>
                <div class="h1 uppercase justify-end">
                    <span class="text-right select-text">{{ display }}</span>
                    <div class="w-4 text-body text-left inline-block">
                        <sub>{{ calc.base !== 10n ? calc.base : '' }}</sub>
                    </div>
                </div>
            </Flex>
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
            <Flex>
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
            </Flex>
            <Grid :columns="5" :rows="6" class="gap-1 p-2" :data-num="calc.base">
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
                <Button variant="none" class="key border-transparent text-disabled" disabled>.</Button>
                <Button class="key rounded-br-[calc(2_*_0.25rem)]" variant="accent" @click="calcInput.type('=')">{{ "="
                    }}</Button>
            </Grid>
        </Flex>

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
@reference '~~/layers/simplytools-ui/app/app.css';

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
<script setup lang="ts">
import type { ComponentAttrs, ComponentProps } from 'vue-component-type-helpers'
import type { Button } from '#components'
import { DevCategory } from '~/utils/pages/dev'
usePageInfo(DevCategory.pages.find(x => x.path === 'progcalc'))

function postprocessNumberKey(key: string, base?: bigint): ComponentProps<typeof Button> & ComponentAttrs<typeof Button> {
    if (base === undefined) {
        base = calc.base
    }
    const disabled: ComponentProps<typeof Button> & ComponentAttrs<typeof Button> = { 'variant': 'none', class: 'border-transparent text-disabled', disabled: true }
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

import type { Reactive } from "vue"

const typeInfo = {
    qword: {
        max: 9223372036854775807n,
        min: -9223372036854775808n,
        mask: 0xFFFF_FFFF_FFFF_FFFFn,
        highestbit: 1n << 63n
    },
    dword: {
        max: 2147483647n,
        min: -2147483648n,
        mask: 0xFFFF_FFFFn,
        highestbit: 1n << 31n
    },
    word: {
        max: 32767n,
        min: -32768n,
        mask: 0xFFFFn,
        highestbit: 1n << 15n
    },
    byte: {
        max: 127n,
        min: -128n,
        mask: 0xFFn,
        highestbit: 1n << 7n
    }
}
type NumType = 'byte' | 'word' | 'dword' | 'qword'
type SupportedBaseBigInt = 16n | 10n | 8n | 2n
type SupportedBase = 16 | 10 | 8 | 2
type BinaryOperator = '&' | '|' | '>>' | '<<' | '%' | '+' | '-' | '×' | '÷'
class ProgrammerCalculator {
    base: 16n | 10n | 8n | 2n = 10n
    private numType: NumType = 'qword'
    shiftMode: 'logical' | 'arith' = 'arith'
    negativeDisplay: 'signed' | 'complement' = 'complement'
    private op: BinaryOperator | 'none' = 'none'
    private prev: bigint = 0n
    private negZero: boolean = false
    value: bigint = 0n
    error: string = ''
    private type2Clear: boolean = false
    expressionDisplay: string = ''
    get NumType() {
        return this.numType
    }
    set NumType(val) {
        this.numType = val
        if (this.isOutsideLimit(this.value)) {
            if (this.value >= 0) {
                this.value = this.value & this.mask()
            } else {
                this.value = this.complement(this.complement(this.value) & this.mask())
            }
            let val = this.value > 0 ? this.value : -this.value
            val = val & this.mask()
        }
    }
    backspace() {
        if (this.type2Clear)
            return
        if (this.negZero) {
            this.negZero = false
            return
        }
        if (this.base === 10n || this.negativeDisplay === 'complement') {
            this.value = (this.value - (this.value % this.base)) / this.base
        } else {
            let val = this.asComplement(this.value)
            val = (val - (val % this.base)) / this.base
            this.value = this.fromComplement(val)
        }
    }
    /** C or CE button */
    clear() {
        if (this.value === 0n) {
            this.op = 'none'
            this.prev = 0n
            this.expressionDisplay = ''
        }
        this.value = 0n
        this.negZero = false
    }
    private mask() {
        return typeInfo[this.numType].mask
    }
    /** flip all bits and add one, also flip the sign of BigInt for convenience */
    private complement(number: bigint) {
        number = (number ^ this.mask()) + 1n
        return -number
    }
    /** if positive or zero, do nothing. if negative, complement the number */
    private asComplement(number: bigint) {
        if (number < 0n) {
            number = this.complement(number)
        }
        return number
    }
    /** If number in complement form represents the negative number, return its complement.
     * Returns itself otherwise
     */
    private fromComplement(number: bigint) {
        if ((number & typeInfo[this.numType].highestbit) !== 0n) {
            number = this.complement(number)
        }
        return number
    }
    /** If number in complement form represents the negative number, return its complement.
     * Returns itself otherwise
     */
    private fromComplementDiscardOverflow(number: bigint) {
        return this.fromComplement(number & typeInfo[this.numType].mask)
    }
    format(number: bigint, radix: SupportedBase | SupportedBaseBigInt, complementMode?: boolean, digit?: number): string {
        if (complementMode === undefined) {
            complementMode = this.negativeDisplay === 'complement'
        }
        if (typeof radix === "bigint") {
            radix = Number(radix) as SupportedBase
        }
        if (digit === undefined) {
            digit = radix === 16 || radix === 2 ? 4 : 3
        }
        if (number < 0 && complementMode && radix !== 10) {
            number = this.complement(number)
        }
        const neg = number < 0n;
        let bin = (neg ? -number : number).toString(radix); // binary string without prefix

        if (bin === "0") return "0";

        const headLen = bin.length % digit;
        const parts: string[] = [];

        if (headLen) parts.push(bin.slice(0, headLen));
        for (let i = headLen; i < bin.length; i += digit) {
            parts.push(bin.slice(i, i + digit));
        }

        const formatted = parts.join(radix === 10 ? "," : " ");
        return neg ? `-${formatted}` : formatted;
    }
    displayOf(num: bigint) {
        return this.format(num, this.base)
    }

    neg() {
        let newNum = -this.value
        if (this.isOutsideLimit(newNum)) {
            return
        }
        this.value = newNum
    }
    binary(newOp: BinaryOperator) {
        if (this.type2Clear && this.op != 'none')
            return
        let display = this.op === 'none' ? this.displayOf(this.value) : this.calc()
        if (this.base !== 10n) {
            display = `${display}<sub>${this.base}</sub>`
        }
        this.expressionDisplay = `${display} ${newOp}`
        this.prev = this.value
        this.op = newOp
        this.type2Clear = true
    }

    calc(): string {
        if (this.op === 'none')
            return this.displayOf(this.value)
        let display = this.displayOf(this.value)
        if (this.base !== 10n) {
            display = `${display}<sub>${this.base}</sub>`
        }
        this.expressionDisplay = `${this.expressionDisplay} ${display} =`
        switch (this.op) {
            case '&':
                this.value = this.fromComplement(this.asComplement(this.prev) & this.asComplement(this.value))
                break
            case '|':
                this.value = this.fromComplement(this.asComplement(this.prev) | this.asComplement(this.value))
                break
            case '+':
                this.value = this.fromComplementDiscardOverflow(this.asComplement(this.prev) + this.asComplement(this.value))
                break
            case '-':
                this.value = this.fromComplementDiscardOverflow(this.asComplement(this.prev) - this.asComplement(this.value))
                break
            case '×':
                this.value = this.fromComplementDiscardOverflow(this.prev * this.value)
                break
            case '÷':
                if (this.value === 0n) {
                    this.error = "Cannot divide by 0"
                    this.value = 0n
                    break
                }
                this.value = this.fromComplementDiscardOverflow(this.prev / this.value)
                break
            case '<<':
                this.value = this.fromComplementDiscardOverflow(this.asComplement(this.prev) << this.value)
                break
            case '>>':
                if (this.shiftMode === 'logical') {
                    let val
                    val = this.asComplement(this.prev) >> this.value
                    this.value = this.fromComplement(val)
                } else if (this.shiftMode === 'arith') {
                    if (this.value > 0n) {
                        let val
                        val = this.asComplement(this.prev) >> this.value
                        this.value = this.fromComplement(val)
                    } else {
                        this.value = this.prev >> this.value
                    }
                }
                break
            case '%':
                this.value = this.prev % this.value
                break
        }
        this.prev = 0n
        this.op = 'none'
        this.type2Clear = true
        return this.displayOf(this.value)
    }
    bitwise_not() {
        // not possible to fell off the number of bits,
        // so can safely ignore the constraints
        // expressionDisplay.value = `~(${display.value})`
        if (this.value >= 0) {
            this.value = this.complement(this.value ^ this.mask())
        } else {
            const comp = this.complement(this.value)
            this.value = comp ^ this.mask()
        }
    }
    append(keyVal: bigint) {
        let val = this.value
        if (this.type2Clear)
            val = 0n
        this.type2Clear = false
        if (keyVal >= this.base)
            return
        if (this.base === 10n || this.negativeDisplay === 'signed') {
            const newNum = val * this.base + keyVal * (this.value < 0 ? -1n : 1n)
            if (this.isOutsideLimit(newNum)) {
                // overflow, disallow typing and overflow
                return
            }
            this.value = newNum
        } else {
            val = this.asComplement(val) * this.base + keyVal
            if (val > typeInfo[this.numType].mask) {
                // overflow, disallow typing and overflow
                return
            }
            this.value = this.fromComplement(val)
        }
    }
    isOutsideLimit(num: bigint): boolean {
        if (num > typeInfo[this.numType].max) {
            return true
        }
        if (num < typeInfo[this.numType].min) {
            return true
        }
        return false
    }
}
class CalculatorUIInput {
    private calc: ProgrammerCalculator | Reactive<ProgrammerCalculator>
    constructor(calc: ProgrammerCalculator | Reactive<ProgrammerCalculator>) {
        this.calc = calc
    }
    type(key: string) {
        if (key === 'Backspace') {
            this.calc.backspace()
            return
        } else if (key === 'Enter' || key === '=' || key === '\n') {
            this.calc.calc()
            return
        } else if (key === '~' || key === '!') {
            this.calc.bitwise_not()
            return
        } else if (key === '&' || key === '|' || key === '>>' || key === '<<' || key === '%' || key === '+' || key === '-' || key === '×' || key === '÷') {
            this.calc.binary(key)
            return
        } else if (key === '>' || key === '<') {
            this.calc.binary(`${key}${key}` as '>>' | '<<')
            return
        } else if (key === '*') {
            this.calc.binary('×')
            return
        } else if (key === '/') {
            this.calc.binary('÷')
            return
        } else if (key === '_' || key === '+/-') {
            this.calc.neg()
            return
        } else if (key === 'x') {
            this.calc.base = 16n
            return
        } else if (key === 'd') {
            this.calc.base = 10n
            return
        } else if (key === 'o') {
            this.calc.base = 8n
            return
        } else if (key === 'b') {
            this.calc.base = 2n
            return
        } else {
            if (key.length !== 1) return
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
                return
            }
            this.calc.append(keyVal)
        }
    }
}
function format(number: bigint, radix: SupportedBase | SupportedBaseBigInt, digit?: number): string {
    if (typeof radix === "bigint") {
        radix = Number(radix) as SupportedBase
    }
    if (digit === undefined) {
        digit = radix === 16 || radix === 2 ? 4 : 3
    }
    const neg = number < 0n;
    let bin = (neg ? -number : number).toString(radix); // binary string without prefix

    if (bin === "0") return "0";

    const headLen = bin.length % digit;
    const parts: string[] = [];

    if (headLen) parts.push(bin.slice(0, headLen));
    for (let i = headLen; i < bin.length; i += digit) {
        parts.push(bin.slice(i, i + digit));
    }

    const formatted = parts.join(radix === 10 ? "," : " ");
    return neg ? `-${formatted}` : formatted;
}
const calc = reactive(new ProgrammerCalculator())
const calcInput = new CalculatorUIInput(calc)
</script>