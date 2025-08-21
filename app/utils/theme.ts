export type Varients = 'accent' | 'control' | 'none'
export type BackgroundVarients = Varients
export type BorderVarients = Varients
export function background(varient : BackgroundVarients) {
    let className : string
    if (varient === 'accent') {
        className = 'bg-accent-primary hover:bg-accent-secondary active:bg-accent-secondary text-on-accent-primary'
    }
    else if (varient === 'control') {
        className = 'bg-control-primary hover:bg-control-secondary active:bg-control-secondary'
    }
    else className = ''
    return className
}

export function border(varient : BorderVarients) {
    let className : string
    if (varient === 'accent') {
        className = 'control-border-accent active:control-border-accent-pressed'
    }
    else if (varient === 'control') {
        className = 'control-border-control active:control-border-control-pressed'
    }
    else className = ''
    return className
}