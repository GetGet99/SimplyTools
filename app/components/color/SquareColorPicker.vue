<script setup lang="ts">
    const color = defineModel<HSV>()
    function pointerDown(e: PointerEvent) {
        if ((e.buttons & 1) === 1) {
            (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
            updateVal(e);
        }
    }
    function pointerMoved(e: MouseEvent) {
        if ((e.buttons & 1) === 1)
            updateVal(e)
    }
    function updateVal(e: MouseEvent) {
        let boundingRect = (e.target as HTMLDivElement).getBoundingClientRect()
        let x = e.clientX - boundingRect.x
        let y = e.clientY - boundingRect.y
        let w = boundingRect.width
        let h = boundingRect.height
        let s = x / w
        if (s < 0) s = 0
        if (s > 1) s = 1
        let v = 1 - (y / h)
        if (v < 0) v = 0
        if (v > 1) v = 1
        color.value = new HSV(color.value?.H ?? 0, s, v)
    }
    function pointerUp(e: PointerEvent) {
        if ((e.buttons & 1) === 1) {
            updateVal(e)
        }
    }
</script>
<template>
    <div class="p-3 rounded-3 not-dark:bg-black bg-gradient-to-tl from-control-primary-dark to-control-primary-light border-control-strong">
        <div class="relative w-full h-full cursor-crosshair" :style="{
            backgroundColor: `hsl(${color?.H ?? 0}, 100%, 50%)`
        }" @pointerdown="pointerDown" @pointermove="pointerMoved" @pointerup="pointerUp">
            <div
                class="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-white to-[#fff0] pointer-events-none">
            </div>
            <div
                class="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-black to-[#0000] pointer-events-none">
            </div>
            <div class="absolute w-4 h-4 -translate-x-1/2 translate-y-1/2 rounded-full border-2 pointer-events-none"
                :style="{
                    bottom: `${(color?.V ?? 0) * 100}%`,
                    left: `${(color?.S ?? 0) * 100}%`,
                    borderColor: (color?.V ?? 0) > 0.25 && (color?.S ?? 0) < 0.30 ? 'black' : 'white'
                }"></div>
        </div>
    </div>
</template>