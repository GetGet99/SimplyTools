function rgb2hsl(r: number, g: number, b: number) {
    // Convert RGB from 0-255 to 0-1
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;

    l = (max + min) / 2;

    if (max === min) {
        // Achromatic
        h = 0;
        s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0));
                break;
            case g:
                h = ((b - r) / d + 2);
                break;
            case b:
                h = ((r - g) / d + 4);
                break;
            default:
                // impossible
                throw Error("Unreachable Error")
        }

        h *= 60; // Convert to degrees
    }

    return new HSL(h, s, l);
}

function hsl2rgb(h: number, s: number, l: number) {
    let r, g, b;

    h = h % 360; // Ensure h is within 0-360
    if (s === 0) {
        // Achromatic (gray)
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        const hFraction = h / 360;
        r = hue2rgb(p, q, hFraction + 1 / 3);
        g = hue2rgb(p, q, hFraction);
        b = hue2rgb(p, q, hFraction - 1 / 3);
    }

    // Convert to 0-255
    return new RGB(
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    );
}
function num2hex(a: number) {
    if (a < 16) {
        return `0${a.toString(16)}`
    } else {
        return a.toString(16)
    }
}
function hexToRgb(hex: string): [number, number, number] {
    // Remove leading #
    hex = hex.replace(/^#/, '');

    let r: number, g: number, b: number;

    if (hex.length === 3 || hex.length === 4) {
        // #RGB → #RRGGBB
        r = parseInt(hex[0]! + hex[0]!, 16);
        g = parseInt(hex[1]! + hex[1]!, 16);
        b = parseInt(hex[2]! + hex[2]!, 16);
    } else if (hex.length === 6) {
        // Optional: ignoring alpha
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        throw Error("Invalid HEX")
    }

    return [r, g, b];
}
function hsl2hsv(h: number, s: number, l: number): HSV {

    const v = l + s * Math.min(l, 1 - l);
    const newS = v === 0 ? 0 : 2 * (1 - l / v);

    return new HSV(h, newS, v);
}
function hsv2hsl(h: number, s: number, v: number): HSL {

    const l = v * (1 - s / 2);
    const newS = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

    return new HSL(h, newS, l);
}
function rgb2hsv(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : d / max;
    const v = max;

    return new HSV(h, s, v);
}
function hsv2rgb(h: number, s: number, v: number) {
    const c = v * s; // chroma
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    // scale back to [0,255]
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return new RGB(r, g, b);
}
export type CopyableStyles = 'css' | 'tuple'
export interface Color {
    get HSL(): HSL
    get HSV(): HSV
    get RGB(): RGB
    get HEX(): HEX
    get CSS(): string
    copyable(style: CopyableStyles): string
}
export class RGB implements Color {
    private r: number
    private g: number
    private b: number
    constructor(r: number, g: number, b: number) {
        this.r = r
        this.g = g
        this.b = b
    }
    get R(): number {
        return this.r
    }
    get G(): number {
        return this.g
    }
    get B(): number {
        return this.b
    }
    get HEX() {
        return HEX.fromRGB(this)
    }
    get HSL(): HSL {
        return rgb2hsl(this.r, this.g, this.b);
    }
    get HSV(): HSV {
        return rgb2hsv(this.r, this.g, this.b);
    }
    get RGB(): RGB {
        return this;
    }
    get CSS(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }
    copyable(style: CopyableStyles): string {
        if (style === 'css')
            return this.CSS
        else
            return `${this.r}, ${this.g}, ${this.b}`
    }
    static Empty() {
        return new RGB(0, 0, 0)
    }
}
export class HSL implements Color {
    private h: number
    private s: number
    private l: number
    constructor(h: number, s: number, l: number) {
        this.h = h
        this.s = s
        this.l = l
    }
    get H(): number {
        return this.h
    }
    get S(): number {
        return this.s
    }
    get L(): number {
        return this.l
    }
    withL(l: number): HSL {
        return new HSL(this.h, this.s, l);
    }
    get HSL(): HSL {
        return this;
    }
    get HSV(): HSV {
        return hsl2hsv(this.h, this.s, this.L);
    }
    get RGB(): RGB {
        return hsl2rgb(this.h, this.s, this.l);
    }
    get HEX(): HEX {
        return this.RGB.HEX;
    }
    get CSS(): string {
        return `hsl(${this.h}, ${this.s * 100}%, ${this.l * 100}%)`
    }
    copyable(style: CopyableStyles): string {
        if (style === 'css')
            return this.CSS
        else
            return `${this.h}, ${this.s}, ${this.l}`
    }
    static Empty() {
        return new HSL(0, 0, 0)
    }
}
export class HSV implements Color {
    private h: number
    private s: number
    private v: number
    constructor(h: number, s: number, v: number) {
        this.h = h
        this.s = s
        this.v = v
    }
    get H(): number {
        return this.h
    }
    get S(): number {
        return this.s
    }
    get V(): number {
        return this.v
    }
    withV(v: number): HSV {
        return new HSV(this.h, this.s, v);
    }
    get HSL(): HSL {
        return hsv2hsl(this.h, this.s, this.v);
    }
    get HSV(): HSV {
        return this;
    }
    get RGB(): RGB {
        return hsv2rgb(this.h, this.s, this.v);
    }
    get HEX(): HEX {
        return this.RGB.HEX;
    }
    get CSS(): string {
        return this.RGB.CSS
    }
    copyable(style: CopyableStyles): string {
        if (style === 'css')
            return `hsv(${this.h}, ${this.s * 100}%, ${this.v * 100}%)`
        else
            return `${this.h}, ${this.s}, ${this.v}`
    }
    static Empty() {
        return new HSV(0, 0, 0)
    }
}
const hexRegex = /^#?([\da-fA-F]{3})([\da-fA-F]{3})?$/
export class HEX extends RGB {
    private code: string
    private constructor(code: string) {
        super(...hexToRgb(code))
        this.code = code
    }
    static fromString(code: string): HEX | undefined {
        if (!hexRegex.test(code)) {
            return undefined
        }
        return new HEX(code)
    }
    static fromRGB(rgb: RGB): HEX {
        return new HEX(`${num2hex(rgb.R)}${num2hex(rgb.G)}${num2hex(rgb.B)}`)
    }
    get HexCode(): string {
        return this.code
    }
    override get HEX(): HEX {
        return this
    }
    override copyable(style: CopyableStyles): string {
        if (style === 'css')
            return this.code[0] === '#' ? this.code : `#${this.code}`
        else
            return this.code
    }
    get HexCodeWithHash(): string {
        return this.code[0] === '#' ? this.code : `#${this.code}`
    }
    static override Empty() {
        return new HEX('000')
    }
}
export function getContrastOnWhiteBlack(color: Color): { 'black': number, 'white': number } {
    let rgb = color.RGB
    // Convert RGB to sRGB [0,1]
    const RsRGB = rgb.R / 255;
    const GsRGB = rgb.G / 255;
    const BsRGB = rgb.B / 255;

    // Linearize sRGB
    const linearize = (c: number) =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const R = linearize(RsRGB);
    const G = linearize(GsRGB);
    const B = linearize(BsRGB);

    // Relative luminance
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    // Contrast ratios with black and white text
    const contrastWithWhite = (1.05) / (L + 0.05);
    const contrastWithBlack = (L + 0.05) / 0.05;


    return {
        white: contrastWithWhite,
        black: contrastWithBlack,
    };
}

export class ColorUtils {
    static darker3(color: Color) {
        const hsl = color.HSL
        return new HSL(hsl.H, hsl.S, hsl.L * (1 - 0.30))
    }
    static darker2(color: Color) {
        const hsl = color.HSL
        return new HSL(hsl.H, hsl.S, hsl.L * (1 - 0.20))
    }
    static darker1(color: Color) {
        const hsl = color.HSL
        return new HSL(hsl.H, hsl.S, hsl.L * (1 - 0.10))
    }
    static brighter1(color: Color) {
        const hsl = color.HSL
        return new HSL(hsl.H, hsl.S, Math.min(hsl.L * (1 + 0.10), 1))
    }
    static brighter2(color: Color) {
        const hsl = color.HSL
        return new HSL(hsl.H, hsl.S, Math.min(hsl.L * (1 + 0.20), 1))
    }
    static brighter3(color: Color) {
        const hsl = color.HSL
        return new HSL(hsl.H, hsl.S, Math.min(hsl.L * (1 + 0.30), 1))
    }
    static invert(color: Color) {
        const rgb = color.RGB
        return new RGB(255 - rgb.R, 255 - rgb.G, 255 - rgb.B)
    }
    static opposite(color: Color) {
        if (color instanceof HSL) {
            let hsl: HSL = color.HSL
            return new HSL((hsl.H + 180) % 360, hsl.S, hsl.L)
        }
        let hsv: HSV = color.HSV
        return new HSV((hsv.H + 180) % 360, hsv.S, hsv.V)
    }
}

export const MIN_READBLE_COLOR_CONTRAST_WCAG_AA = 4.5;
export const MIN_READBLE_COLOR_CONTRAST = 2;
// /**
//  * Returns 'black' or 'white' depending on which has better contrast
//  * with the given background color.
//  */
// export function getContrastTextColor(color: Color): 'black' | 'white' {
//     const rgb = color.RGB;

//     // Calculate perceived brightness
//     const brightness = 0.299 * rgb.R + 0.587 * rgb.G + 0.114 * rgb.B;

//     // Use threshold 186 (common heuristic) to decide text color
//     return brightness > 186 ? 'black' : 'white';
// }