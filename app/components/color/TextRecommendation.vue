<script setup lang="ts">
    const props = defineProps<{ color: Color }>()
    const contrastResult = computed(() => getContrastOnWhiteBlack(props.color as Color))
    const contrastWinner = computed(() => getContrastOnWhiteBlack(props.color as Color))
</script>
<template>
    <div class="flex flex-col gap-4">
        <h3 class="text-center">Text & Background Combinations</h3>
        <h4 class="text-center">Recommended</h4>
        <div class="grid gap-2 grid-cols-2 justify-center items-center">
            <template v-if="contrastResult.black > contrastResult.white">
                <div class="p-control rounded-4 text-center text-black" :style="{ backgroundColor: color.CSS }">
                    Black Text</div>
                <div class="p-control rounded-4 text-center bg-black" :style="{ color: color.CSS }">
                    Black Background</div>
                <div class="col-span-2 text-center">
                    Contrast: {{ Math.round(contrastResult.black * 100) / 100 }}
                </div>
            </template>
            <template v-else>
                <div class="p-control rounded-4 text-center text-white" :style="{ backgroundColor: color.CSS }">
                    White Text</div>
                <div class="p-control rounded-4 text-center bg-white" :style="{ color: color.CSS }">
                    White Background</div>
                <div class="col-span-2 text-center">
                    Contrast: {{ Math.round(contrastResult.white * 100) / 100 }}
                </div>
            </template>
        </div>
        <h4 v-if="Math.min(contrastResult.black, contrastResult.white) >= MIN_READBLE_COLOR_CONTRAST"
            class="text-center">
            Hornorable Mentioned
        </h4>
        <h4 v-else class="text-center">Not Recommended</h4>
        <div class="grid gap-2 grid-cols-2 justify-center items-center">
            <template v-if="contrastResult.black <= contrastResult.white">
                <div class="p-control rounded-4 text-center text-black" :style="{ backgroundColor: color.CSS }">
                    Black Text</div>
                <div class="p-control rounded-4 text-center bg-black" :style="{ color: color.CSS }">
                    Black Background</div>
            </template>
            <template v-else>
                <div class="p-control rounded-4 text-center text-white" :style="{ backgroundColor: color.CSS }">
                    White Text</div>
                <div class="p-control rounded-4 text-center bg-white" :style="{ color: color.CSS }">
                    White Background</div>
            </template>
            <div class="col-span-2 text-center">
                Contrast: {{ Math.round(Math.min(contrastResult.black, contrastResult.white) * 100)
                    / 100
                }}<br />
                <span v-if="Math.min(contrastResult.black, contrastResult.white) >= MIN_READBLE_COLOR_CONTRAST_WCAG_AA">
                    Contrast satistifies WCAG AA standard ({{ ">" +
                        MIN_READBLE_COLOR_CONTRAST_WCAG_AA.toString() }})
                </span>
                <span v-else>
                    Contrast is below WCAG AA standard ({{ ">" +
                        MIN_READBLE_COLOR_CONTRAST_WCAG_AA.toString() }})
                </span>
            </div>
        </div>
    </div>
</template>