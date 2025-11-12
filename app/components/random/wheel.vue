<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
    list: string[]
    size?: number
    innerRadius?: number
    colors?: string[]
}>()

// default palette (Tailwind fill classes) — can be overridden via props.colors
const DEFAULT_COLORS = ['fill-blue-600', 'fill-red-600', 'fill-green-700', 'fill-yellow-600']

const colorsArray = computed(() => {
    return (props.colors && props.colors.length > 0) ? props.colors : DEFAULT_COLORS
})

const emit = defineEmits<{
    (e: 'select', index: number): void
}>()

const SIZE = props.size ?? 500
const INNER_RADIUS = props.innerRadius ?? 72

const spinningIndex = ref(0) // in "item units" (0..len)
const rolling = ref(false)

const len = computed(() => props.list.length)
const sliceAngle = computed(() => (len.value ? 360 / len.value : 360))
const radius = computed(() => SIZE / 2)

function easeOutQuad(t: number) {
    return 1 - Math.pow(1 - t, 4);
}
function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3)
}
function easeLinear(t: number) {
    return t
}

/**
 * Start a spin. If `target` is provided it should be an integer index in [0, len-1].
 * Returns the final selected index or undefined if a spin could not be started.
 *
 * Snapping phase removed: we animate directly to the final absolute position,
 * then normalize spinningIndex to the integer finalIndex and emit it.
 */
function rollForItem(target: number | undefined = undefined): number | undefined {
    if (rolling.value || len.value === 0) return

    rolling.value = true

    const TOTAL_DURATION = 9_000
    const spinDuration = TOTAL_DURATION
    const minItemsPassed = 30
    const fullSpins = 8

    // choose a float target index; subtract 0.5 so rounding behaves like "closest"
    let randomFloat =
        target !== undefined ? (target + 0.5) : Math.random() * len.value
    const finalIndex = Math.floor(randomFloat)

    const start = performance.now()
    const startActualOffset = spinningIndex.value
    const startOffset = Math.round(startActualOffset)

    // compute total distance in item-units for a DECREASING spin (we will subtract this)
    let totalDistance = startOffset - randomFloat + fullSpins * len.value
    if (totalDistance < minItemsPassed) {
        const needed = Math.ceil((minItemsPassed - (startActualOffset - randomFloat)) / len.value)
        const adjusted = Math.max(fullSpins, needed)
        totalDistance = startOffset - randomFloat + adjusted * len.value
    }

    if (spinDuration <= 0) {
        // Instant finish: set normalized index and emit
        spinningIndex.value = finalIndex
        rolling.value = false
        emit('select', finalIndex)
    } else {
        function spinAnimate(now: number) {
            const elapsed = now - start
            const t = Math.min(elapsed / spinDuration, 1)
            const eased = easeOutQuad(t)
            // decrease fractional value during animation (spin in opposite direction)
            spinningIndex.value = startOffset - totalDistance * eased

            if (t < 1) {
                requestAnimationFrame(spinAnimate)
            } else {
                // normalize into [0, len-1], handling negative values
                const n = props.list.length
                spinningIndex.value = ((spinningIndex.value % n) + n) % n
                rolling.value = false
                emit('select', finalIndex)
            }
        }

        requestAnimationFrame(spinAnimate)
    }

    console.log(randomFloat)
    return finalIndex
}

defineExpose({ rollForItem })

const rotationStyle = computed(() => {
    // transform rotation in degrees. negative so increasing index rotates wheel clockwise.
    const degrees = -spinningIndex.value * sliceAngle.value
    return { transform: `rotate(${degrees}deg)` }
})

function itemAngle(i: number) {
    return i * sliceAngle.value
}

</script>

<template>
    <div :style="{ width: SIZE + 'px', height: SIZE + 'px' }"
        class="relative select-none rotate-90 pointer-events-none">
        <!-- Wheel container -->
        <div :style="{ width: SIZE + 'px', height: SIZE + 'px' }"
            class="relative rounded-full border bg-control-primary border-border-control-primary flex items-center justify-center">
            <!-- Rotating group -->
            <div class="absolute inset-0 flex items-center justify-center will-change-transform transform-gpu"
                :style="rotationStyle">
                <!-- Each item placed around the circle -->
                <svg :width="SIZE" :height="SIZE" class="w-full h-full">
                    <g :transform="`translate(${radius}, ${radius})`">
                        <g v-for="(item, i) in list" :key="i">
                            <path :d="(() => {
                                const start = i * sliceAngle
                                const end = (i + 1) * sliceAngle
                                const rOuter = radius
                                const rInner = INNER_RADIUS
                                const cx = 0, cy = 0
                                const toPoint = (r: number, angle: number) => {
                                    const a = (angle - 90) * Math.PI / 180
                                    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
                                }
                                const oS = toPoint(rOuter, start)
                                const oE = toPoint(rOuter, end)
                                const iE = toPoint(rInner, end)
                                const iS = toPoint(rInner, start)
                                const large = (end - start) > 180 ? 1 : 0
                                if (rInner === 0) {
                                    return `M ${oS.x} ${oS.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${oE.x} ${oE.y} L 0 0 Z`
                                }
                                return `M ${oS.x} ${oS.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${oE.x} ${oE.y} L ${iE.x} ${iE.y} A ${rInner} ${rInner} 0 ${large} 0 ${iS.x} ${iS.y} Z`
                            })()" :class="colorsArray[i % colorsArray.length]" stroke="rgba(0,0,0,0.2)"
                                stroke-width="1" />
                            <text class="fill-white font-semibold" :transform="(() => {
                                const mid = (i + 0.5) * sliceAngle
                                const a = (mid - 90) * Math.PI / 180
                                const r = Math.max((radius + INNER_RADIUS) / 2, 10)
                                const x = r * Math.cos(a)
                                const y = r * Math.sin(a)
                                const rotateDeg = mid - 90
                                return `translate(${x}, ${y}) rotate(${rotateDeg})`
                            })()" :style="(() => {
                                    // approximate available straight width by the arc length at the label radius
                                    const r = Math.max((radius + INNER_RADIUS) / 2, 10)
                                    const arc = (sliceAngle * Math.PI / 180) * r
                                    const padding = 8
                                    const avail = Math.max(0, arc - padding)
                                    const chars = String(item).length || 1
                                    const avgCharRatio = 0.6 // approx width of one character in em units
                                    const maxFont = 12
                                    const minFont = 8
                                    const fontPx = Math.floor(Math.min(maxFont, Math.max(minFont, avail / (chars * avgCharRatio))))
                                    return { fontSize: fontPx + 'px' }
                                })()" text-anchor="middle" dominant-baseline="middle" pointer-events="none">{{ item
                                }}</text>
                        </g>
                    </g>
                </svg>
            </div>

            <!-- pointer at top -->
            <div :style="{ left: (SIZE / 2 - 8) + 'px', top: '-8px', rotate: '180deg' }"
                class="absolute w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-accent-primary pointer-events-none drop-shadow">
            </div>
        </div>
    </div>
</template>