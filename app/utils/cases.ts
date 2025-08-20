class CASESAPI {
    constructor() { }
    /** 
     * @param {string} input Input String
     * @returns {string} An output string of all uppercase.
     */
    uppercase(input: string): string {
        return input.toUpperCase()
    }
    /** 
     * @param {string} input Input String
     * @returns {string} An output string of all lowercase.
     */
    lowercase(input: string): string {
        return input.toLowerCase()
    }
    /** 
     * @param {string} input Input String
     * @returns {string} An output string with cases swapped
     */
    swappingcase(input: string): string {
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
    randomcase(input: string): string {
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
}
export default new CASESAPI()