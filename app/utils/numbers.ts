export type BigIntInputModes = 'hex' | 'binary' | 'octal'
export type IntegerInputModes = 'integer' | 'integer_positive'
export type NumberInputModes = IntegerInputModes | 'real' | 'real_positive'
export type AnyNumberInputModes = NumberInputModes | BigIntInputModes
export const NumberNegativeSignBypass: { [key in AnyNumberInputModes]: boolean } = {
    real: true,
    integer: true,
    hex: true,
    binary: true,
    octal: true,
    real_positive: false,
    integer_positive: false
}
export const NumberInputRegexes: { [key in AnyNumberInputModes]: RegExp } = {
    real: /^-?([0-9]*[.])?[0-9]*$/,
    integer: /^-?[0-9][0-9]*$/,
    real_positive: /^([0-9]*[.])?[0-9]*$/,
    integer_positive: /^[0-9]+$/,
    hex: /^-?[0-9a-fA-F]+$/,
    binary: /^-?[0-1]+$/,
    octal: /^-?[0-7]+$/,
}
export const NumberNormalizeInput: { [key in AnyNumberInputModes]: (x: string) => string } = {
    real: normalizeFuncWithNegative(/[^0-9.\-]/g, true),
    integer: normalizeFuncWithNegative(/[^0-9\-]/g),
    real_positive: normalizeFuncWithoutNegative(/[^0-9.]/g, true),
    integer_positive: normalizeFuncWithoutNegative(/[^0-9]/g),
    hex: normalizeFuncWithNegative(/[^0-9a-fA-F\-]/g),
    binary: normalizeFuncWithNegative(/[^0-1\-]/g),
    octal: normalizeFuncWithNegative(/[^0-7\-]/g),
}
function normalizeFuncWithNegative(charsExclude: RegExp, allowDecimal = false) {
    return function (input: string): string {
        input = input.slice(0, 100);
        let normalized = input.replace(charsExclude, "");

        // Keep only the first "-" at the start
        if (normalized.startsWith("-")) {
            normalized = "-" + normalized.slice(1).replace(/-/g, "");
        } else {
            normalized = normalized.replace(/-/g, "");
        }

        // Keep only the first "."
        if (allowDecimal) {
            const firstDot = normalized.indexOf(".");
            if (firstDot !== -1) {
                normalized =
                    normalized.slice(0, firstDot + 1) +
                    normalized
                        .slice(firstDot + 1)
                        .replace(/\./g, ""); // remove extra dots
            }
        }

        return normalized;
    };
}

function normalizeFuncWithoutNegative(charsExclude: RegExp, allowDecimal = false) {
    return function (input: string): string {
        input = input.slice(0, 100);
        let normalized = input.replace(charsExclude, "");

        // No "-" handling needed

        // Keep only the first "."
        if (allowDecimal) {
            const firstDot = normalized.indexOf(".");
            if (firstDot !== -1) {
                normalized =
                    normalized.slice(0, firstDot + 1) +
                    normalized
                        .slice(firstDot + 1)
                        .replace(/\./g, "");
            }
        }

        return normalized;
    };
}