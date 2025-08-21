<script setup lang="ts">
    const color = defineModel<HSL>()
    function updateVal(h: number) {
        const original = color.value ?? HSL.Empty()
        color.value = new HSL(h, original.S, original.L)
    }
</script>

<template>
    <SliderRoot as="div" :model-value="[color?.H ?? 0]" @update:model-value="x => updateVal(x![0]!)" :min=0 :max=360 :step="0.1"
        class="relative h-4 flex touch-none">
        <SliderTrack class="relative h-4 hue grow rounded-full" :style="{
            // '--sat': `${(color?.S ?? 1) * 100}%`,
            // '--light': `${(color?.L ?? 0.5) * 100}%`
        }">
            <SliderRange class="absolute h-full" />
        </SliderTrack>

        <SliderThumb
            class="block w-4 h-4 border-2 rounded-full outline-2 outline-transparent border-foreground focus:outline-foreground outline-offset-4" 
            :style="{
                '--color-foreground': color && color.H > 30 && color.H < 90 ? 'black' : 'white'
            }" />
    </SliderRoot>
</template>
<style lang="css" scoped>
    .hue {
        background: linear-gradient(to right,
                hsl(0, var(--sat, 100%), var(--light, 50%)) 0%,
                hsl(61.2, var(--sat, 100%), var(--light, 50%)) 17%,
                hsl(118.8, var(--sat, 100%), var(--light, 50%)) 33%,
                hsl(180, var(--sat, 100%), var(--light, 50%)) 50%,
                hsl(241.2, var(--sat, 100%), var(--light, 50%)) 67%,
                hsl(298.8, var(--sat, 100%), var(--light, 50%)) 83%,
                hsl(360, var(--sat, 100%), var(--light, 50%)) 100%);
    }
</style>