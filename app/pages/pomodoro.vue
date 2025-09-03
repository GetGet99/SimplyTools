<script setup lang="ts">
import PlayIcon from '@fluentui/svg-icons/icons/play_24_regular.svg?raw'
import PauseIcon from '@fluentui/svg-icons/icons/pause_24_regular.svg?raw'
import ResetIcon from '@fluentui/svg-icons/icons/arrow_clockwise_24_regular.svg?raw'
import aud from '~/assets/beep-313342.mp3'
import { ref, computed, watch } from 'vue'

const MODES = [
    { name: 'Pomodoro', duration: 25 * 60 },
    { name: 'Short Break', duration: 5 * 60 },
    { name: 'Long Break', duration: 15 * 60 },
    // { name: 'Test', duration: 3 },
]

const modeIdx = ref(0)
const secondsLeft = ref(MODES[modeIdx.value]!.duration)
const running = ref(false)
let timer: NodeJS.Timeout | null = null
let audioPlayer = import.meta.client ? new Audio(aud) : null
if (audioPlayer) audioPlayer.loop = true
function start() {
    if (!running.value) {
        running.value = true
        timer = setInterval(() => {
            if (secondsLeft.value > 0) {
                secondsLeft.value--
            } else {
                audioPlayer!.play()
            }
        }, 1000)
    }
}

function stop() {
    running.value = false
    audioPlayer!.pause()
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

function reset() {
    stop()
    secondsLeft.value = MODES[modeIdx.value]!.duration
}

function switchMode(idx: number) {
    modeIdx.value = idx
    reset()
}

watch(modeIdx, () => {
    secondsLeft.value = MODES[modeIdx.value]!.duration
})

const minutes = computed(() => Math.floor(secondsLeft.value / 60).toString().padStart(2, '0'))
const seconds = computed(() => (secondsLeft.value % 60).toString().padStart(2, '0'))
</script>

<template>
    <Feature category="none" tool="Pomodoro Timer" class="flex justify-center">
        <div class="flex flex-col items-center gap-8 w-full">
            <div class="flex gap-4">
                <Button v-for="(m, idx) in MODES" :key="m.name"
                    :variant="modeIdx === idx ? 'accent' : 'control'" @click="switchMode(idx)">
                    {{ m.name }}
                </Button>
            </div>
            <div class="flex flex-col items-center gap-4">
                <div class="text-6xl sm:text-9xl">
                    {{ minutes }}:{{ seconds }}
                </div>
                <div class="flex gap-4">
                    <Button variant="accent" v-if="!running" @click="start" :disabled="running" title="Start" class="p-4 rounded-full">
                        <Icon :icon="PlayIcon" alt="Start" class="w-5 h-5" />
                    </Button>
                    <Button variant="accent" v-else @click="stop" :disabled="!running" title="Pause" class="p-4 rounded-full">
                        <Icon :icon="PauseIcon" alt="Pause" class="w-5 h-5" />
                    </Button>
                    <Button @click="reset" title="Reset" class="p-4 rounded-full">
                        <Icon :icon="ResetIcon" alt="Reset" class="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
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