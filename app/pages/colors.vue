<script setup lang="ts">
    const color = ref<Color>(HEX.fromString("7b2929")!) as Ref<Color>
</script>
<template>
    <Feature category="none" tool="Color Playground" class="not-sm:w-full not-sm:h-full sm:flex sm:justify-center">
        <div class="flex flex-col gap-4">
            <div class="grid md:grid-cols-[auto_auto_auto] lg:grid-cols-[auto_auto_auto_auto_auto] justify-center gap-4">
                <div class="flex items-start">
                    <div class="grid gap-4">
                        <h2 class="text-h2 text-center">Color Picker</h2>
                        <ColorSquareColorPicker class="w-80 h-80" :model-value="color.HSV"
                            @update:model-value="x => color = (x as HSV)" />
                        <ColorHueSlider class="w-full h-4" :model-value="color.HSL"
                            @update:model-value="x => color = (x as HSL)" />
                        <!-- Just some gap to looks nice in styling -->
                        <div class="hidden md:block"></div>
                    </div>
                </div>
                <hr class="hidden h-full md:block border-r border-t-0 border-control-strong" />
                <div class="flex flex-col gap-6 -order-1 md:order-0 shrink-0">
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
                <hr class="hidden h-full lg:block border-r border-t-0 border-control-strong" />
                <ColorTextRecommendation :color class="col-span-1 lg:col-span-1 md:col-span-3" />
            </div>
            <div class="md:col-span-2 lg:col-span-1">
                <div class="md:flex md:flex-col items-center">
                    <h2 class="text-center">Other Colors</h2>
                    <div class="not-md:w-[calc(100vw_-_4rem)] not-md:overflow-x-auto max-h-80 md:overflow-y-auto">
                        <div class="flex gap-4 p-4 md:flex-wrap">
                            <ColorAlternateDisplay name="Darker 3" :processor=ColorUtils.darker3 v-model="color" />
                            <ColorAlternateDisplay name="Darker 2" :processor=ColorUtils.darker2 v-model="color" />
                            <ColorAlternateDisplay name="Darker 1" :processor=ColorUtils.darker1 v-model="color" />
                            <ColorAlternateDisplay class="not-sm:-order-1" name="Inverted" :processor=ColorUtils.invert v-model="color" />
                            <ColorAlternateDisplay class="not-sm:-order-1" name="Opposite" :processor=ColorUtils.opposite v-model="color" />
                            <ColorAlternateDisplay name="Brighter 1" :processor=ColorUtils.brighter1 v-model="color" />
                            <ColorAlternateDisplay name="Brighter 2" :processor=ColorUtils.brighter2 v-model="color" />
                            <ColorAlternateDisplay name="Brighter 3" :processor=ColorUtils.brighter3 v-model="color" />
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <template #summary>
            Easily pick a color and manipulate their properties
        </template>
        <template #details>
            Unfortunately, I have not written this yet. 😅
        </template>
    </Feature>
</template>