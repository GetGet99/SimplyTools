<script setup lang="ts">
    const props = defineProps<{ color: Color }>()
    const contrastResult = computed(() => getContrastOnWhiteBlack(props.color as Color))
    const contrastWinner = computed(() => getContrastOnWhiteBlack(props.color as Color))
</script>
<template>
    <div class="flex flex-col gap-4">
        <h2 class="text-center">Text & Background Combinations</h2>
        <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
            <div class="flex flex-col gap-4">
                <h3 class="text-center">Recommended</h3>
                <div class="grid gap-2 grid-cols-2 justify-center items-center">
                    <template v-if="contrastResult.black > contrastResult.white">
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
                        Contrast: {{ Math.round(Math.max(contrastResult.black, contrastResult.white) * 100) / 100 }}<br />
                        <span
                            v-if="Math.max(contrastResult.black, contrastResult.white) >= MIN_READBLE_COLOR_CONTRAST_WCAG_AA">
                            Contrast satistifies WCAG AA standard ({{ ">" +
                                MIN_READBLE_COLOR_CONTRAST_WCAG_AA.toString() }})
                        </span>
                        <span v-else>
                            Contrast is below WCAG AA standard ({{ "<" +
                                MIN_READBLE_COLOR_CONTRAST_WCAG_AA.toString() }})
                        </span>
                    </div>
                </div>
            </div>
            <hr class="hidden lg:hidden md:block h-full border-r border-t-0 border-control-strong" />
            <div class="flex flex-col gap-4">
                <h3 v-if="Math.min(contrastResult.black, contrastResult.white) >= MIN_READBLE_COLOR_CONTRAST"
                    class="text-center">
                    Hornorable Mentioned
                </h3>
                <h3 v-else class="text-center">Not Recommended</h3>
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
                        <span
                            v-if="Math.min(contrastResult.black, contrastResult.white) >= MIN_READBLE_COLOR_CONTRAST_WCAG_AA">
                            Contrast satistifies WCAG AA standard ({{ ">" +
                                MIN_READBLE_COLOR_CONTRAST_WCAG_AA.toString() }})
                        </span>
                        <span v-else>
                            Contrast is below WCAG AA standard ({{ "<" +
                                MIN_READBLE_COLOR_CONTRAST_WCAG_AA.toString() }})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>