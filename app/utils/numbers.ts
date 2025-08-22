export type BigIntInputModes = 'hex' | 'binary' | 'octal'
export type IntegerInputModes = 'integer' | 'integer_positive'
export type NumberInputModes = IntegerInputModes | 'real' | 'real_positive'
export type AnyNumberInputModes = NumberInputModes | BigIntInputModes
export const NumberNegativeSignBypass : { [key in AnyNumberInputModes] : boolean } = {
    real: true,
    integer: true,
    hex: true,
    binary: true,
    octal: true,
    real_positive: false,
    integer_positive: false
}
export const NumberInputRegexes : { [key in AnyNumberInputModes] : RegExp } = {
    real: /^-?([0-9]*[.])?[0-9]*$/,
    integer: /^-?[0-9]+$/,
    real_positive: /^([0-9]*[.])?[0-9]*$/,
    integer_positive: /^[0-9]+$/,
    hex: /^[0-9a-fA-F]+$/,
    binary: /^[0-1]+$/,
    octal: /^[0-7]+$/,
}