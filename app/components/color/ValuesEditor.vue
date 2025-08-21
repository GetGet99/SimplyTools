<script setup lang="ts">
    import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
    const color = defineModel<Color>()
    function rgbInputUpdate(r: number | undefined, g: number | undefined, b: number | undefined) {
        let col = color.value?.RGB ?? new RGB(0, 0, 0)
        color.value = new RGB(r ?? col.R, g ?? col.G, b ?? col.B)
    }
    function hslInputUpdate(h: number | undefined, s: number | undefined, l: number | undefined) {
        let col = color.value?.HSL ?? new HSL(0, 0, 0)
        color.value = new HSL(h ?? col.H, s ?? col.S, l ?? col.L)
    }
    function hsvInputUpdate(h: number | undefined, s: number | undefined, v: number | undefined) {
        let col = color.value?.HSV ?? new HSV(0, 0, 0)
        color.value = new HSV(h ?? col.H, s ?? col.S, v ?? col.V)
    }
    function percentShow(n: number | undefined, type: 'HSL' | 'HSV') {
        if (n === undefined)
            return undefined
        if (color.value instanceof HSL && type === 'HSL')
            // use types the number, keep full precision    
            return n * 100
        if (color.value instanceof HSV && type === 'HSV')
            // use types the number, keep full precision    
            return n * 100
        return Math.round(n * 1000) / 10
    }
    function copyText(str : string) {
        navigator.clipboard.writeText(str)
    }
    const hsVFULL = computed(() => (color.value?.HSV.withV(1) ?? HSV.Empty()).RGB)
    const vOnly = computed(() => new HSV(0, 0, color.value?.HSV.V ?? 0).RGB)
</script>
<template>
    <div class="grid items-center gap-4" style="grid-template-columns: auto repeat(3, minmax(0, 1fr)) auto;">
        <span>RGB</span>
        <NumberBox :model-value="color?.RGB.R ?? undefined"
            @update:model-value="r => rgbInputUpdate(r, undefined, undefined)" placeholder="R" mode="integer"
            class="box rgbBG text-red-800 dark:text-red-300" :style="{ '--color-r': color?.RGB.R ?? 0 }" />
        <NumberBox :model-value="color?.RGB.G ?? undefined"
            @update:model-value="g => rgbInputUpdate(undefined, g, undefined)" placeholder="G" mode="integer"
            class="box rgbBG text-green-800 dark:text-green-300"
            :style="{ '--color-g': color?.RGB.G ?? 0 }" />
        <NumberBox :model-value="color?.RGB.B ?? undefined"
            @update:model-value="b => rgbInputUpdate(undefined, undefined, b)" placeholder="B" mode="integer"
            class="box rgbBG text-blue-800 dark:text-blue-300"
            :style="{ '--color-b': color?.RGB.B ?? 0 }" />
        <Button class="p-button-icon" title="Copy"
            @click="copyText((color?.RGB ?? RGB.Empty()).copyable('css'))"
        >
            <Icon :icon=CopyIcon alt="" />
        </Button>
        <span>HSL</span>
        <NumberBox :model-value="color?.HSL.H ?? undefined"
            @update:model-value="h => hslInputUpdate(h, undefined, undefined)" placeholder="H" mode="real"
            class="box hslBG" :style="{
                '--color-hue': color?.HSL.H ?? 0,
            }" />
        <NumberBox :model-value="percentShow(color?.HSL.S, 'HSL')"
            @update:model-value="s => hslInputUpdate(undefined, (s ?? 0) / 100, undefined)" placeholder="S" mode="real"
            class="box hslBG" :style="{
                '--color-hue': color?.HSL.H ?? 0,
                '--color-sat': `${(color?.HSL.S ?? 0) * 100}%`
            }" />
        <NumberBox :model-value="percentShow(color?.HSL.L, 'HSL')"
            @update:model-value="l => hslInputUpdate(undefined, undefined, (l ?? 0) / 100)" placeholder="V" mode="real"
            class="box hslBG" :style="{
                '--color-hue': 0,
                '--color-sat': '0%',
                '--color-light': `${(color?.HSL.L ?? 0) * 100}%`,
            }" />
        <Button class="p-button-icon" title="Copy"
            @click="copyText((color?.HSL ?? HSL.Empty()).copyable('css'))"
        >
            <Icon :icon=CopyIcon alt="" />
        </Button>
        <span>HSV</span>
        <NumberBox :model-value="color?.HSV.H ?? undefined"
            @update:model-value="h => hsvInputUpdate(h, undefined, undefined)" placeholder="H" mode="real"
            class="box hslBG" :style="{
                '--color-hue': color?.HSV.H ?? 0,
            }" />
        <NumberBox :model-value="percentShow(color?.HSV.S, 'HSV')"
            @update:model-value="s => hsvInputUpdate(undefined, (s ?? 0) / 100, undefined)" placeholder="S" mode="real"
            class="box rgbBG" :style="{
                '--color-r': hsVFULL.R,
                '--color-g': hsVFULL.G,
                '--color-b': hsVFULL.B
            }" />
        <NumberBox :model-value="percentShow(color?.HSV.V, 'HSV')"
            @update:model-value="v => hsvInputUpdate(undefined, undefined, (v ?? 0) / 100)" placeholder="V" mode="real"
            class="box rgbBG" :style="{
                '--color-r': vOnly.R,
                '--color-g': vOnly.G,
                '--color-b': vOnly.B
            }" />
        <Button class="p-button-icon" title="Copy"
            @click="copyText((color?.HSV ?? HSV.Empty()).copyable('css'))"
        >
            <Icon :icon=CopyIcon alt="" />
        </Button>
    </div>
</template>
<style lang="css" scoped>
    @reference '../../app.css';

    .hslBG {
        @apply focus:border-b-textbox-accent-highlight!;
        border-inline-color: hsl(var(--color-hue), var(--color-sat, 100%), var(--color-light, 50%));
        border-top-color: hsl(var(--color-hue), var(--color-sat, 100%), var(--color-light, 50%));
        border-bottom-color: hsl(var(--color-hue), var(--color-sat, 100%), calc(var(--color-light, 50%) + 25%));
        background-color: hsla(var(--color-hue), var(--color-sat, 100%), var(--color-light, 50%), 20%) !important;
    }

    .rgbBG {
        @apply focus:border-b-textbox-accent-highlight!;
        border-inline-color: rgb(var(--color-r, 0), var(--color-g, 0), var(--color-b, 0));
        border-top-color: rgb(var(--color-r, 0), var(--color-g, 0), var(--color-b, 0));
        border-bottom-color: rgb(calc(var(--color-r, -51) + 51), calc(var(--color-g, -51) + 51), calc(var(--color-b, -51) + 51));
        background-color: rgba(var(--color-r, 0), var(--color-g, 0), var(--color-b, 0), 20%) !important;
    }
    .box {
        @apply w-15 text-center;
    }
</style>