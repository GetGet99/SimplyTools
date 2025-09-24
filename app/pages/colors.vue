<script setup lang="ts">
import { Uncategorized } from '~/utils/pages/uncategorized'
usePageInfo(Uncategorized.pages.find(x => x.path === 'colors'))
const color = ref<Color>(HEX.fromString("7b2929")!) as Ref<Color>
</script>
<template>
    <Feature category="none" tool="Color Playground" class="not-sm:w-full not-sm:h-full sm:flex sm:justify-center">
        <Flex column class="gap-4">
            <Grid md-columns="auto auto auto" lg-columns="auto auto auto auto auto" class="justify-center gap-4">
                <Flex class="items-start">
                    <Grid class="gap-4">
                        <h2 class="text-h2 text-center">Color Picker</h2>
                        <ColorSquareColorPicker class="w-80 h-80" :model-value="color.HSV"
                            @update:model-value="x => color = (x as HSV)" />
                        <ColorHueSlider class="w-full h-4" :model-value="color.HSL"
                            @update:model-value="x => color = (x as HSL)" />
                        <!-- Just some gap to looks nice in styling -->
                        <div class="hidden md:block"></div>
                    </Grid>
                </Flex>
                <hr class="hidden h-full md:block border-r border-t-0 border-control-strong" />
                <Flex column class="gap-6 -order-1 md:order-0 shrink-0">
                    <h2 class="text-h2 text-center">Color Preview</h2>
                    <Flex class="justify-center">
                        <div class="w-30 h-30 rounded-full border border-control-strong" :style="{
                            backgroundColor: color.CSS
                        }"></div>
                    </Flex>
                    <Flex class="justify-center">
                        <ColorHexEditor class="w-30 text-center" :model-value="color.HEX"
                            @update:model-value="x => color = (x as HEX)" />
                    </Flex>
                    <ColorValuesEditor v-model="color" />
                </Flex>
                <hr class="hidden h-full lg:block border-r border-t-0 border-control-strong" />
                <ColorTextRecommendation :color class="col-span-1 lg:col-span-1 md:col-span-3" />
            </Grid>
            <div class="md:col-span-2 lg:col-span-1">
                <div class="md:flex md:flex-col items-center">
                    <h2 class="text-center">Other Colors</h2>
                    <div class="not-md:w-[calc(100vw_-_4rem)] not-md:overflow-x-auto max-h-80 md:overflow-y-auto">
                        <Flex class="gap-4 p-4 md:flex-wrap">
                            <ColorAlternateDisplay name="Darker 3" :processor=ColorUtils.darker3 v-model="color" />
                            <ColorAlternateDisplay name="Darker 2" :processor=ColorUtils.darker2 v-model="color" />
                            <ColorAlternateDisplay name="Darker 1" :processor=ColorUtils.darker1 v-model="color" />
                            <ColorAlternateDisplay class="not-sm:-order-1" name="Inverted" :processor=ColorUtils.invert
                                v-model="color" />
                            <ColorAlternateDisplay class="not-sm:-order-1" name="Opposite"
                                :processor=ColorUtils.opposite v-model="color" />
                            <ColorAlternateDisplay name="Brighter 1" :processor=ColorUtils.brighter1 v-model="color" />
                            <ColorAlternateDisplay name="Brighter 2" :processor=ColorUtils.brighter2 v-model="color" />
                            <ColorAlternateDisplay name="Brighter 3" :processor=ColorUtils.brighter3 v-model="color" />

                        </Flex>
                    </div>
                </div>
            </div>
        </Flex>
        <template #summary>
            Pick a color, view contrast recommendations, and explore variations like brighter, darker, inverted, and
            opposite.
        </template>

        <template #details>
            <p>
                The Color Playground helps you select and experiment with colors while checking their accessibility and
                contrast levels. Pick any shade from the color picker and instantly see its RGB, HSL, and HSV values.
            </p>
            <ul>
                <li>Preview text and background combinations with automatic WCAG contrast checks.</li>
                <li>Generate related shades such as darker, brighter, inverted, and opposite colors.</li>
                <li>Copy color codes or apply them instantly for quick design adjustments.</li>
                <li>Use it directly in your browser on any device — no external servers involved.</li>
            </ul>
            <p>
                Whether you’re a designer, developer, or just experimenting with palettes, this tool makes working with
                colors faster and more accessible.
            </p>
        </template>
    </Feature>
</template>