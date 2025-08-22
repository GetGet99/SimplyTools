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
export type NumType = 'byte' | 'word' | 'dword' | 'qword'
export type SupportedBaseBigInt = 16n | 10n | 8n | 2n
export type SupportedBase = 16 | 10 | 8 | 2
export type BinaryOperator = '&' | '|' | '>>' | '<<' | '%' | '+' | '-' | '×' | '÷'
export class ProgrammerCalculator {
    base: 16n | 10n | 8n | 2n = 10n
    private numType: NumType = 'qword'
    shiftMode: 'logical' | 'arith' = 'arith'
    negativeDisplay: 'signed' | 'complement' = 'complement'
    private op: BinaryOperator | 'none' = 'none'
    private prev: bigint = 0n
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
        const d = this.op === 'none' ? this.displayOf(this.value) : this.calc()
        this.expressionDisplay = `${d} ${newOp}`
        this.prev = this.value
        this.op = newOp
        this.type2Clear = true
    }

    calc(): string {
        if (this.op === 'none')
            return this.displayOf(this.value)
        this.expressionDisplay = `${this.expressionDisplay} ${this.displayOf(this.value)} =`
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
export class CalculatorUIInput {
    private calc: ProgrammerCalculator | Reactive<ProgrammerCalculator>
    constructor(calc: ProgrammerCalculator | Reactive<ProgrammerCalculator>) {
        this.calc = calc
    }
    type(key: string) {
        if (key === 'Backspace') {
            this.calc.backspace()
            return
        } else if (key === 'Enter' || key === '=') {
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
export function format(number: bigint, radix: SupportedBase | SupportedBaseBigInt, digit?: number): string {
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