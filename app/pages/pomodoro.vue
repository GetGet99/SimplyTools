<script setup lang="ts">
import PlayIcon from '@fluentui/svg-icons/icons/play_24_regular.svg?raw'
import PauseIcon from '@fluentui/svg-icons/icons/pause_24_regular.svg?raw'
import ResetIcon from '@fluentui/svg-icons/icons/arrow_clockwise_24_regular.svg?raw'
import aud from '~/assets/beep-313342.mp3'
import { ref, computed, watch } from 'vue'

import { Uncategorized } from '~/utils/pages/uncategorized'
setPageInfo(Uncategorized.pages.find(x => x.path === 'pomodoro'))
const MODES = [
    { name: 'Pomodoro', duration: 25 * 60 * 1000 },
    { name: 'Short Break', duration: 5 * 60 * 1000 },
    { name: 'Long Break', duration: 15 * 60 * 1000 },
    // { name: 'Test', duration: 3 * 1000 },
]

const modeIdx = ref(0)
const timeLeftMs = ref(MODES[modeIdx.value]!.duration)
const running = ref(false)
let rafId: number | null = null
let startTimestamp = 0
let endTimestamp = 0
let audioPlayer = import.meta.client ? new Audio(aud) : null
if (audioPlayer) audioPlayer.loop = true

function tick() {
    if (!running.value) return
    const now = performance.now()
    const remaining = Math.max(endTimestamp - now, 0)
    timeLeftMs.value = remaining
    if (remaining > 0) {
        rafId = requestAnimationFrame(tick)
    } else {
        timeLeftMs.value = 0
        audioPlayer?.play()
        running.value = false
    }
}

function start() {
    if (!running.value) {
        running.value = true
        startTimestamp = performance.now()
        endTimestamp = startTimestamp + timeLeftMs.value
        rafId = requestAnimationFrame(tick)
    }
}

function stop() {
    running.value = false
    audioPlayer?.pause()
    if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
    // Update timeLeftMs to current remaining time
    const now = performance.now()
    timeLeftMs.value = Math.max(endTimestamp - now, 0)
}

function reset() {
    stop()
    timeLeftMs.value = MODES[modeIdx.value]!.duration
}

function switchMode(idx: number) {
    modeIdx.value = idx
    reset()
}

watch(modeIdx, () => {
    timeLeftMs.value = MODES[modeIdx.value]!.duration
})

const minutes = computed(() => Math.floor(timeLeftMs.value / 60000).toString().padStart(2, '0'))
const seconds = computed(() => Math.floor((timeLeftMs.value % 60000) / 1000).toString().padStart(2, '0'))
const thousands = computed(() => Math.floor((timeLeftMs.value % 1000)).toString().padStart(3, '0'))

const router = useRouter()
let removeNuxtGuard: (() => void) | null = null

function beforeUnloadHandler(e: BeforeUnloadEvent) {
    if (running.value) {
        e.preventDefault()
        e.returnValue = 'Timer is running. Are you sure you want to leave?'
        return 'Timer is running. Are you sure you want to leave?'
    }
}

function nuxtNavigationGuard(to: any, from: any, next: any) {
    if (running.value) {
        if (confirm('Timer is running. Are you sure you want to leave?')) {
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
    // Add Nuxt navigation guard
    removeNuxtGuard = router.beforeEach(nuxtNavigationGuard)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler)
    // Remove Nuxt navigation guard
    if (removeNuxtGuard) {
        removeNuxtGuard()
        removeNuxtGuard = null
    }
})
</script>

<template>
    <Feature category="none" tool="Pomodoro Timer" class="flex justify-center">
        <Flex column class="items-center gap-8 w-full">
            <Flex class="gap-4">
                <Button v-for="(m, idx) in MODES" :key="m.name"
                    :variant="modeIdx === idx ? 'accent' : 'regular'" @click="switchMode(idx)">
                    {{ m.name }}
                </Button>
            </Flex>
            <Flex column class="items-center gap-4">
                <div class="text-6xl sm:text-9xl">
                    {{ minutes }}:{{ seconds }}<span class="text-4xl sm:text-6xl">.</span><span class="text-4xl">{{ thousands }}</span>
                </div>
                <Flex class="gap-4">
                    <Button variant="accent" v-if="!running" @click="start" :disabled="running" title="Start" class="p-4 rounded-full">
                        <Icon :icon="PlayIcon" alt="Start" class="w-5 h-5" />
                    </Button>
                    <Button variant="accent" v-else @click="stop" :disabled="!running" title="Pause" class="p-4 rounded-full">
                        <Icon :icon="PauseIcon" alt="Pause" class="w-5 h-5" />
                    </Button>
                    <Button @click="reset" title="Reset" class="p-4 rounded-full">
                        <Icon :icon="ResetIcon" alt="Reset" class="w-5 h-5" />
                    </Button>
                </Flex>
            </Flex>
            <div class="text-center mt-4 text-lg text-placeholder">
                <span class="font-semibold">Recommended Flow:</span>
                <span>
                    Pomodoro <span class="mx-1">&rarr;</span>
                    Short Break <span class="mx-1">&rarr;</span>
                    Pomodoro <span class="mx-1">&rarr;</span>
                    Short Break <span class="mx-1">&rarr;</span>
                    Pomodoro <span class="mx-1">&rarr;</span>
                    Long Break
                </span>
            </div>
        </Flex>
        <template #summary>
            Simple Pomodoro timer to boost your productivity.
        </template>
        <template #details>
            <p>
                Use the Pomodoro technique: 25 minutes of focused work, followed by short or long breaks.
                Switch modes as needed. Timer runs in your browser.
            </p>
        </template>
    </Feature>
</template>