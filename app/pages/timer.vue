<script setup lang="ts">
import PlayIcon from '@fluentui/svg-icons/icons/play_24_regular.svg?raw'
import PauseIcon from '@fluentui/svg-icons/icons/pause_24_regular.svg?raw'
import ResetIcon from '@fluentui/svg-icons/icons/arrow_clockwise_24_regular.svg?raw'
import EditIcon from '@fluentui/svg-icons/icons/edit_24_regular.svg?raw'
const DEFAULT_HOURS = 0
const DEFAULT_MINUTES = 5
const DEFAULT_SECONDS = 0

const hoursInput = ref(DEFAULT_HOURS)
const minutesInput = ref(DEFAULT_MINUTES)
const secondsInput = ref(DEFAULT_SECONDS)
const timeLeftMs = ref((hoursInput.value * 3600 + minutesInput.value * 60 + secondsInput.value) * 1000)
const running = ref(false)
const editing = ref(true)
let rafId: number | null = null
let startTimestamp = 0
let endTimestamp = 0

function updateTimeLeft() {
    timeLeftMs.value = (hoursInput.value * 3600 + minutesInput.value * 60 + secondsInput.value) * 1000
}

watch([hoursInput, minutesInput, secondsInput], updateTimeLeft)

function tick() {
    if (!running.value) return
    const now = performance.now()
    const remaining = Math.max(endTimestamp - now, 0)
    timeLeftMs.value = remaining
    if (remaining > 0) {
        rafId = requestAnimationFrame(tick)
    } else {
        timeLeftMs.value = 0
        running.value = false
    }
}

function start() {
    editing.value = false
    if (!running.value && timeLeftMs.value > 0) {
        running.value = true
        startTimestamp = performance.now()
        endTimestamp = startTimestamp + timeLeftMs.value
        rafId = requestAnimationFrame(tick)
    }
}

function stop() {
    running.value = false
    if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
    const now = performance.now()
    timeLeftMs.value = Math.max(endTimestamp - now, 0)
}

function reset() {
    stop()
    updateTimeLeft()
}

const minutes = computed(() => Math.floor(timeLeftMs.value / 60000).toString().padStart(2, '0'))
const seconds = computed(() => Math.floor((timeLeftMs.value % 60000) / 1000).toString().padStart(2, '0'))
const thousands = computed(() => Math.floor((timeLeftMs.value % 1000)).toString().padStart(3, '0'))

function beforeUnloadHandler(e: BeforeUnloadEvent) {
    if (running.value) {
        e.preventDefault()
        e.returnValue = 'Timer is running. Are you sure you want to leave?'
        return 'Timer is running. Are you sure you want to leave?'
    }
}

const router = useRouter()
let removeNuxtGuard: (() => void) | null = null

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
    removeNuxtGuard = router.beforeEach(nuxtNavigationGuard)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler)
    if (removeNuxtGuard) {
        removeNuxtGuard()
        removeNuxtGuard = null
    }
})
const minutesInputRef = useTemplateRef('minutesInputRef')
const secondsInputRef = useTemplateRef('secondsInputRef')

watch(minutesInput, (val, oldVal) => {
    if (val >= 10 && val !== oldVal && minutesInputRef.value) {
        // Move focus to seconds input
        secondsInputRef.value?.nbb?.tb?.focus()
    }
})
</script>

<template>
    <Feature category="none" tool="Timer" class="flex justify-center">
        <div class="flex flex-col items-center gap-8 w-full">
            <div v-if="editing" class="flex flex-col items-center gap-6 w-full max-w-xs">
                <div class="text-lg font-semibold mb-2">Set Timer</div>
                <div class="flex gap-4 justify-center">
                    <NumberBox
                        placeholder="Hours"
                        mode='integer_positive'
                        v-model="hoursInput"
                        :min="0"
                        class="w-20"
                    />
                    <span class="text-2xl font-bold">:</span>
                    <NumberBox
                        ref="minutesInputRef"
                        placeholder="Minutes"
                        mode="integer_0_to_60"
                        v-model="minutesInput"
                        :min="0"
                        :max="99"
                        class="w-20"
                    />
                    <span class="text-2xl font-bold">:</span>
                    <NumberBox
                        ref="secondsInputRef"
                        v-model="secondsInput"
                        :min="0"
                        :max="59"
                        mode="integer_0_to_60"
                        placeholder="Seconds"
                        class="w-20"
                    />
                </div>
                <Button variant="accent" @click="start" :disabled="timeLeftMs <= 0" class="mt-4 flex">
                    <Icon :icon="PlayIcon" alt="Start" class="w-5 h-5 mr-2" />
                    Start Timer
                </Button>
            </div>
            <div v-else class="flex flex-col items-center gap-6 w-full max-w-xs">
                <div class="text-6xl sm:text-8xl">
                    {{ minutes }}:{{ seconds }}<span class="text-3xl sm:text-5xl">.</span><span class="text-3xl">{{ thousands }}</span>
                </div>
                <div class="flex gap-4 mt-2">
                    <Button v-if="!running" @click="reset" title="Reset" class="p-4 rounded-full">
                        <Icon :icon="ResetIcon" alt="Reset" class="w-5 h-5" />
                    </Button>
                    <Button v-if="!running" variant="accent" @click="start" title="Continue Timer" class="p-4 rounded-full">
                        <Icon :icon="PlayIcon" alt="Continue" class="w-5 h-5" />
                    </Button>
                    <Button v-else variant="accent" @click="stop" title="Pause" class="p-4 rounded-full">
                        <Icon :icon="PauseIcon" alt="Pause" class="w-5 h-5" />
                    </Button>
                    <Button v-if="!running" @click="editing = true" title="Edit Time" class="p-4 rounded-full">
                        <Icon :icon="EditIcon" alt="Edit" class="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
        <template #summary>
            Simple timer with customizable time.
        </template>
        <template #details>
            <p>
                Set any duration and start the timer. Pause, reset, or edit the time as needed.
            </p>
        </template>
    </Feature>
</template>