<script setup lang="ts">
    import type { ComponentAttrs, ComponentProps } from 'vue-component-type-helpers'
    import type { Button } from '#components'
    const base = ref<16n | 10n | 8n | 2n>(10n)
    const limit = ref<'byte' | 'word' | 'dword' | 'qword'>('qword')
    const signed = ref<'unsigned' | 'signed' | 'signed_display'>('signed')
    const expressionDisplay = ref('')
    const type2Clear = ref(false)
    const shiftMode = ref<'logical' | 'arith'>('arith')
    const hideFocus = ref(false)
    const error = ref<string>('')
    type BinaryOp = '&' | '|' | '>>' | '<<' | '%' | '+' | '-' | '×' | '÷'
    let op: 'none' | BinaryOp = 'none'
    let prev = 0n
    const limitMap = {
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
    function isOutsideLimit(num: bigint): boolean {
        if (num > limitMap[limit.value].max) {
            return true
        }
        if (num < limitMap[limit.value].min) {
            return true
        }
        if (signed.value === 'unsigned' && num < 0) {
            return true
        }
        return false
    }
    function backspace() {
        if (type2Clear.value)
            return
        if (base.value === 10n || signed.value === 'signed_display') {
            value.value = (value.value - (value.value % base.value)) / base.value
        } else {
            let val = asComplement(value.value)
            val = (val - (val % base.value)) / base.value
            value.value = fromComplement(val)
        }
    }
    function neg() {
        let newNum = -value.value
        if (isOutsideLimit(newNum)) {
            return
        }
        value.value = newNum
    }
    function binary(newOp: BinaryOp) {
        if (type2Clear.value && op != 'none')
            return
        const d = op === 'none' ? display.value : calc()
        expressionDisplay.value = `${d} ${newOp}`
        prev = value.value
        op = newOp
        type2Clear.value = true
    }
    function calc(): string {
        if (op === 'none')
            return display.value
        expressionDisplay.value = `${expressionDisplay.value} ${display.value} =`
        switch (op) {
            case '&':
                value.value = fromComplement(asComplement(prev) & asComplement(value.value))
                break
            case '|':
                value.value = fromComplement(asComplement(prev) | asComplement(value.value))
                break
            case '+':
                value.value = fromComplementDiscardOverflow(asComplement(prev) + asComplement(value.value))
                break
            case '-':
                value.value = fromComplementDiscardOverflow(asComplement(prev) - asComplement(value.value))
                break
            case '×':
                value.value = fromComplementDiscardOverflow(prev * value.value)
                break
            case '÷':
                if (value.value === 0n) {
                    error.value = "Cannot divide by 0"
                    value.value = 0n
                    break
                }
                value.value = fromComplementDiscardOverflow(prev / value.value)
                break
            case '<<':
                value.value = fromComplementDiscardOverflow(asComplement(prev) << value.value)
                break
            case '>>':
                if (shiftMode.value === 'logical') {
                    let val
                    val = asComplement(prev) >> value.value
                    value.value = fromComplement(val)
                } else if (shiftMode.value === 'arith') {
                    if (value.value > 0n) {
                        let val
                        val = asComplement(prev) >> value.value
                        value.value = fromComplement(val)
                    } else {
                        value.value = prev >> value.value
                    }
                }
                break
            case '%':
                value.value = prev % value.value
                break
        }
        prev = 0n
        op = 'none'
        type2Clear.value = true
        return displayOf(value.value)
    }
    function bitwise_not() {
        // not possible to fell off the number of bits,
        // so can safely ignore the constraints
        // expressionDisplay.value = `~(${display.value})`
        if (value.value >= 0) {
            value.value = complement(value.value ^ mask())
        } else {
            const comp = complement(value.value)
            value.value = comp ^ mask()
        }
    }
    function append(keyVal: bigint) {
        let val = value.value
        if (type2Clear.value)
            val = 0n
        type2Clear.value = false
        if (keyVal >= base.value)
            return
        if (base.value === 10n || signed.value === 'signed_display') {
            const newNum = val * base.value + keyVal * (value.value < 0 ? -1n : 1n)
            if (isOutsideLimit(newNum)) {
                // overflow, disallow typing and overflow
                return
            }
            value.value = newNum
        } else {
            val = asComplement(val) * base.value + keyVal
            if (val > limitMap[limit.value].mask) {
                // overflow, disallow typing and overflow
                return
            }
            value.value = fromComplement(val)
        }
    }
    const value = ref<bigint>(0n)
    function keydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
        type(e.key)
    }
    function type(key: string) {
        if (key === 'Backspace') {
            backspace()
            return
        } else if (key === 'Enter' || key === '=') {
            calc()
            return
        } else if (key === '~' || key === '!') {
            bitwise_not()
            return
        } else if (key === '&' || key === '|' || key === '>>' || key === '<<' || key === '%' || key === '+' || key === '-' || key === '×' || key === '÷') {
            binary(key)
            return
        } else if (key === '>' || key === '<') {
            binary(`${key}${key}` as '>>' | '<<')
            return
        } else if (key === '*') {
            binary('×')
            return
        } else if (key === '/') {
            binary('÷')
            return
        } else if (key === '_' || key === '+/-') {
            neg()
            return
        } else if (key === 'x') {
            base.value = 16n
            return
        } else if (key === 'd') {
            base.value = 10n
            return
        } else if (key === 'o') {
            base.value = 8n
            return
        } else if (key === 'b') {
            base.value = 2n
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
            append(keyVal)
        }
    }
    function mask() {
        return limitMap[limit.value].mask
    }
    /** flip all bits and add one, also flip the sign of BigInt for convenience */
    function complement(number: bigint) {
        number = (number ^ mask()) + 1n
        return -number
    }
    /** if positive or zero, do nothing. if negative, complement the number */
    function asComplement(number: bigint) {
        if (number < 0n) {
            number = complement(number)
        }
        return number
    }
    /** If number in complement form represents the negative number, return its complement.
     * Returns itself otherwise
     */
    function fromComplement(number: bigint) {
        if ((number & limitMap[limit.value].highestbit) !== 0n) {
            number = complement(number)
        }
        return number
    }
    /** If number in complement form represents the negative number, return its complement.
     * Returns itself otherwise
     */
    function fromComplementDiscardOverflow(number: bigint) {
        return fromComplement(number & limitMap[limit.value].mask)
    }
    watch(() => signed.value, () => {
        if (signed.value === 'unsigned') {
            if (value.value < 0) {
                value.value = complement(value.value)
            }
        }
    })
    watch(() => limit.value, () => {
        if (isOutsideLimit(value.value)) {
            if (value.value >= 0) {
                value.value = value.value & mask()
            } else {
                value.value = complement(complement(value.value) & mask())
            }
            let val = value.value > 0 ? value.value : -value.value
            val = val & mask()
        }
    })
    onMounted(() => {
        window.addEventListener('keydown', keydown)
    })
    onUnmounted(() => {
        window.removeEventListener('keydown', keydown)
    })
    function format(number: bigint, radix: number, digit: number, complementMode: boolean): string {
        if (number < 0 && complementMode && radix !== 10) {
            number = complement(number)
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
    function postprocessNumber(key: string, base: bigint): ComponentProps<typeof Button> & ComponentAttrs<typeof Button> {
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
    function displayOf(num: bigint) {
        return format(num, Number(base.value), base.value === 16n || base.value === 2n ? 4 : 3, signed.value === 'signed')
    }
    const display = computed(() => error.value || displayOf(value.value))

</script>
<template>
    <Feature category="dev" tool="Programmer Calculator" class="flex justify-center">
        <div class="flex flex-col w-full sm:w-[unset] sm:min-w-100 gap-2 bg-card pt-4 rounded-4">
            <div class="flex flex-col text-right">
                <span class="h2 h-5 text-subtitle uppercase mr-4">{{ expressionDisplay }}</span>
                <div class="h1 uppercase justify-end">
                    <span class="text-right select-text">{{ display }}</span>
                    <div class="w-4 text-body text-left inline-block">
                        <sub>{{ base !== 10n ? base
                            : '' }}</sub>
                    </div>
                </div>
            </div>
            <Button v-if="signed !== 'unsigned'" class="bg-transparent border-transparent" @click="() => {
                if (signed === 'signed') {
                    signed = 'signed_display'
                } else {
                    signed = 'signed'
                }
            }">{{ signed === 'signed' ? 'Negative Display: BITS' : 'Negative Display: NUMBER' }}</Button>
            <ToggleGroupRoot model-value="base" @update:model-value="x => x && (base = x as typeof base)"
                class="grid grid-rows-4 gap-2 text-sm">
                <ToggleGroupItem as-child v-for="b in [16n, 10n, 8n, 2n]" :value=b>
                    <Button class="baseDisplay bg-transparent border-transparent h-10 flex items-center"
                        :class="base === b ? 'selected' : ''">
                        <span class="label" :class="base === b ? 'selected' : ''">
                            {{ b === 16n ? 'HEX' :
                                (b === 10n ? 'DEC' :
                                    (b === 8n ? 'OCT' :
                                        'BIN')) }}
                        </span>
                        <span class="max-w-75 uppercase text-left" style="line-height: 16px;">{{ format(value,
                            Number(b),
                            b === 16n || b === 2n ? 4 : 3,
                            signed === 'signed'
                        ) }}</span>
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
                    if (limit === 'byte') {
                        limit = 'qword'
                    } else if (limit === 'qword') {
                        limit = 'dword'
                    } else if (limit === 'dword') {
                        limit = 'word'
                    } else if (limit === 'word') {
                        limit = 'byte'
                    }
                }">{{ limit }}</Button>
                <Button class="w-50 bg-transparent border-transparent" @click="() => {
                    if (shiftMode === 'arith') {
                        shiftMode = 'logical'
                    } else {
                        shiftMode = 'arith'
                    }
                }">Shift mode: {{ shiftMode.toUpperCase() }}</Button>
            </div>
            <div class="grid grid-cols-5 grid-row-6 gap-1 p-2" :data-num="base">
                <Button class="key" v-for="c in ['A', '<<', '>>']" v-bind="postprocessNumber(c, base)"
                    @click="type(c)">{{ c }}</Button>
                <Button class="key" @click="() => {
                    if (value === 0n) {
                        op = 'none'
                        prev = 0n
                        expressionDisplay = ''
                    }
                    value = 0n
                }">{{ value === 0n ? 'C' : 'CE' }}</Button>
                <Button class="key" @click="backspace()">DEL</Button>
                <Button class="key" v-for="c in ['B', '(', ')', '%', '÷']" v-bind="postprocessNumber(c, base)"
                    @click="type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['C', '7', '8', '9', '×']" v-bind="postprocessNumber(c, base)"
                    @click="type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['D', '4', '5', '6', '-']" v-bind="postprocessNumber(c, base)"
                    @click="type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['E', '1', '2', '3', '+']" v-bind="postprocessNumber(c, base)"
                    @click="type(c)">{{ c }}</Button>
                <Button class="key" v-for="c in ['F', '+/-', '0']" v-bind="postprocessNumber(c, base)"
                    @click="type(c)">{{ c }}</Button>
                <Button varient="none" class="key border-transparent text-disabled" disabled>.</Button>
                <Button class="key rounded-br-[calc(2_*_0.25rem)]" varient="accent" @click="type('=')">{{ "="
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
                <li>Choose how negative numbers appear: as raw two’s complement bits (e.g., <code>FFFF FF85</code>) or as the signed value (e.g., <code>-7B</code>).</li>
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