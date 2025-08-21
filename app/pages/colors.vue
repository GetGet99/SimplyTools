<script setup lang="ts">
    const color = ref<Color>(new RGB(0x20, 0x20, 0x20)) as Ref<Color>
</script>
<template>
    <Feature category="none" tool="Color Playground" class="flex justify-center">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col-reverse md:grid md:grid-cols-[auto_auto] lg:grid-cols-[auto_auto_auto] justify-center gap-4">
                <div class="flex items-start">
                    <div class="grid gap-3">
                        <ColorSquareColorPicker class="w-80 h-80" :model-value="color.HSV"
                            @update:model-value="x => color = (x as HSV)" />
                        <ColorHueSlider class="w-full h-4" :model-value="color.HSL"
                            @update:model-value="x => color = (x as HSL)" />
                    </div>
                </div>
                <div class="flex flex-col gap-6 shrink-0">
                    <h2 class="text-h2 text-center">Color Preview</h2>
                    <div class="flex justify-center">
                        <div class="w-30 h-30 rounded-full border border-control-strong" :style="{
                            backgroundColor: color.CSS
                        }"></div>
                    </div>
                    <div class="flex justify-center">
                        <ColorHexEditor class="w-30 text-center" :model-value="color.HEX"
                            @update:model-value="x => color = (x as HEX)" />
                    </div>
                    <ColorValuesEditor v-model="color" />
                </div>
                <div class="flex flex-col md:flex-row gap-4 justify-center md:col-span-2 lg:col-span-1">
                    <ColorAlternateDisplay name="Inverted" :processor=ColorUtils.invert v-model="color" />
                    <ColorAlternateDisplay name="Opposite" :processor=ColorUtils.opposite v-model="color" />
                </div>
            </div>
            <ColorTextRecommendation :color />

        </div>
        <template #summary>
            Easily pick a color and manipulate their properties
        </template>
        <template>
            Unfortunately, I have not written this yet. 😅
        </template>
    </Feature>
</template>