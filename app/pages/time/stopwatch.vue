<script setup lang="ts">

setPageInfo(TimeCategory.pages.find(x => x.path === 'stopwatch'))

const running = ref(false)
const rafId: { value: number | null } = { value: null }
let startTimestamp = 0
const elapsedOffset = ref(0) // accumulated when paused, in ms
const timeMs = ref(0) // current displayed elapsed time in ms
const laps = ref<number[]>([])

function tick() {
    if (!running.value) return
    const now = performance.now()
    timeMs.value = elapsedOffset.value + (now - startTimestamp)
    rafId.value = requestAnimationFrame(tick)
}

function start() {
    if (running.value) return
    running.value = true
    startTimestamp = performance.now()
    rafId.value = requestAnimationFrame(tick)
}

function stop() {
    if (!running.value) return
    running.value = false
    if (rafId.value) {
        cancelAnimationFrame(rafId.value)
        rafId.value = null
    }
    // persist elapsed time to offset
    const now = performance.now()
    elapsedOffset.value = Math.max(elapsedOffset.value + (now - startTimestamp), 0)
    timeMs.value = elapsedOffset.value
}

function reset() {
    if (rafId.value) {
        cancelAnimationFrame(rafId.value)
        rafId.value = null
    }
    running.value = false
    elapsedOffset.value = 0
    timeMs.value = 0
    laps.value = []
}

function lap() {
    if (!running.value) return
    laps.value.unshift(timeMs.value) // newest first
}

// formatting helpers
const hours = computed(() => Math.floor(timeMs.value / 3600000).toString().padStart(2, '0'))
const minutes = computed(() => Math.floor((timeMs.value % 3600000) / 60000).toString().padStart(2, '0'))
const seconds = computed(() => Math.floor((timeMs.value % 60000) / 1000).toString().padStart(2, '0'))
const thousands = computed(() => Math.floor(timeMs.value % 1000).toString().padStart(3, '0'))

function formatLap(ms: number) {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const msPart = Math.floor(ms % 1000)
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${msPart.toString().padStart(3, '0')}`
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${msPart.toString().padStart(3, '0')}`
}

// navigation / unload guards
function beforeUnloadHandler(e: BeforeUnloadEvent) {
    if (running.value) {
        e.preventDefault()
        e.returnValue = 'Stopwatch is running. Are you sure you want to leave?'
        return 'Stopwatch is running. Are you sure you want to leave?'
    }
}

const router = useRouter()
let removeNuxtGuard: (() => void) | null = null

function nuxtNavigationGuard(to: any, from: any, next: any) {
    if (running.value) {
        if (confirm('Stopwatch is running. Are you sure you want to leave?')) {
            next()
        } else {
            next(false)
        }
    } else {
        next()
    }
}

onMounted(() => {
    window.addEventListener('beforeunload', beforeUnloadHandler)
    removeNuxtGuard = router.beforeEach(nuxtNavigationGuard)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler)
    if (removeNuxtGuard) {
        removeNuxtGuard()
        removeNuxtGuard = null
    }
    if (rafId.value) {
        cancelAnimationFrame(rafId.value)
        rafId.value = null
    }
})
</script>

<template>
    <Feature category="none" tool="Stopwatch" class="flex justify-center">
        <Flex column class="items-center gap-8 w-full">
            <Flex column class="items-center gap-6 w-full max-w-xs">
                <div class="text-6xl sm:text-8xl font-mono">
                    {{ hours }}:{{ minutes }}:{{ seconds }}<span class="text-3xl sm:text-5xl">.</span><span class="text-3xl">{{ thousands }}</span>
                </div>
                <Flex class="gap-4 mt-2">
                    <Button v-if="!running" variant="accent" @click="start" title="Start" class="p-4 rounded-full">
                        <IconPlay alt="Start" class="w-5 h-5" />
                    </Button>
                    <Button v-else variant="accent" @click="stop" title="Pause" class="p-4 rounded-full">
                        <IconPause alt="Pause" class="w-5 h-5" />
                    </Button>
                    <Button :disabled="!running" @click="lap" title="Lap" class="p-4 rounded-full">
                        <IconFlag alt="Lap" class="w-5 h-5" />
                    </Button>
                    <Button @click="reset" title="Reset" class="p-4 rounded-full">
                        <IconArrowClockwise alt="Reset" class="w-5 h-5" />
                    </Button>
                </Flex>

                <div v-if="laps.length" class="w-full mt-4 max-h-48 overflow-auto bg-surface-100 rounded-md p-3">
                    <div class="text-sm text-muted mb-2">Laps (newest first)</div>
                    <ul class="flex flex-col gap-2">
                        <li v-for="(lapTime, idx) in laps" :key="idx" class="flex justify-between text-sm">
                            <span class="font-medium">#{{ laps.length - idx }}</span>
                            <span class="font-mono">{{ formatLap(lapTime) }}</span>
                        </li>
                    </ul>
                    <Flex class="mt-3 justify-end">
                        <Button :disabled="!laps.length" @click="laps.splice(0, laps.length)" title="Clear laps">
                            Clear laps
                        </Button>
                    </Flex>
                </div>
            </Flex>
        </Flex>

        <template #summary>
            Simple stopwatch with lap support.
        </template>

        <template #details>
            <p>
                Start the stopwatch, record laps, pause or reset. Navigation and unload are guarded while running.
            </p>
        </template>
    </Feature>
</template>