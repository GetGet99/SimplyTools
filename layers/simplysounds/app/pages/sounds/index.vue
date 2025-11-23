<template>
    <Feature category="sounds" tool="Make your own sounds!" details-visible="always">
        <Flex column class="gap-8 group" :data-touch="toolsExpanded">
            <Flex column class="items-center gap-6 w-full p-8">
                <div class="mb-4">Make Sounds! Add notes! Make loops! And listen!</div>
                <!-- Playing Context controls -->
                <div class="w-full mb-6">
                    <SimplySoundsContextBlocks v-model:statements="playingContext.statements" />
                </div>
                <Flex class="gap-2 items-center">
                    <Button v-if="!isPlaying" class="pl-1.25 flex gap-1" @click="Sounds.playContext"
                        :disabled="playingContext.statements.length === 0">
                        <IconPlay alt="" />
                        Play Sound
                    </Button>
                    <Button v-else variant="regular" title="Stop Playback" class="pl-1.25 flex gap-1"
                        @click="Sounds.stopSequence">
                        <IconStop alt="" />
                        Stop Sound
                    </Button>
                    <Button class="flex gap-1" @click="Sounds.exportAsWAV()">
                        Export
                    </Button>
                </Flex>
            </Flex>
        </Flex>

        <!-- Floating tools using Tailwind & Button.vue component -->
        <Flex
            class="fixed right-6 bottom-7 z-40 gap-2 items-end backdrop-blur-lg p-2 border rounded-lg border-border-control-primary">
            <Flex v-show="toolsExpanded" class="gap-2 items-center shadow-lg">
                <ToggleButton v-model="previewMode" class="flex items-center gap-1 text-base min-w-[40px]"
                    :aria-pressed="previewMode">
                    <IconPlay alt="Play Sound" />
                    Tap to Preview Notes
                </ToggleButton>
                <!-- Add more tool buttons here -->
            </Flex>
            <ToggleButton v-model="toolsExpanded" :aria-label="toolsExpanded ? 'Close Tools' : 'Open Tools'"
                class="pl-1.25 flex gap-1">
                <IconHandPoint alt="" />
                Touchscreen Compatibility
            </ToggleButton>
            <Flex class="gap-2">
                <Button v-if="!isPlaying" class="pl-1.25 flex gap-1 border-accent-primary" @click="Sounds.playContext"
                    :disabled="playingContext.statements.length === 0">
                    <IconPlay alt="Play Sound" />
                    Play
                </Button>
                <Button v-else variant="regular" title="Stop Playback" class="pl-1.25 flex gap-1"
                    @click="Sounds.stopSequence">
                    <IconStop alt="Stop Playback" />
                    Stop
                </Button>
            </Flex>
        </Flex>

        <template #summary>
            Play notes and sequences with customizable synth types.
        </template>
        <template #details>
            <p>
                Select a synth type and note, play individual notes or build a sequence. Powered by Tone.js.
            </p>
            <div class="mt-4 space-y-2">
                <p class="font-semibold">Keyboard Navigation:</p>
                <ul class="list-disc list-inside space-y-1 text-sm">
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> / <kbd
                            class="px-1.5 py-0.5 bg-muted rounded text-xs">Arrow Keys</kbd> - Navigate between notes
                    </li>
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> / <kbd
                            class="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> - Preview/Activate note</li>
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Delete</kbd> / <kbd
                            class="px-1.5 py-0.5 bg-muted rounded text-xs">Backspace</kbd> - Remove note</li>
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">D</kbd> - Duplicate note</li>
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Shift</kbd> + <kbd
                            class="px-1.5 py-0.5 bg-muted rounded text-xs">Left/Right</kbd> - Adjust note length</li>
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Shift</kbd> + <kbd
                            class="px-1.5 py-0.5 bg-muted rounded text-xs">Up/Down</kbd> - Adjust note pitch</li>
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Alt</kbd> + <kbd
                            class="px-1.5 py-0.5 bg-muted rounded text-xs">Left/Right</kbd> - Reorder notes</li>
                    <li><kbd class="px-1.5 py-0.5 bg-muted rounded text-xs">Shift</kbd> + <kbd
                            class="px-1.5 py-0.5 bg-muted rounded text-xs">Scroll</kbd> - Adjust note length</li>
                </ul>
            </div>
        </template>
    </Feature>
</template>

<script setup lang="ts">
usePageInfo(Apps.pages.find(x => x.path === 'sounds'))
import { ref, computed, provide } from 'vue'
import * as Tone from 'tone'
import * as Sounds from '../../lib/shared';
const synthType = Sounds.synthType
const playingContext = Sounds.playingContext
const isPlaying = Sounds.isPlaying
const jumpingNote = Sounds.jumpingNote
const jumpingSpecial = Sounds.jumpingSpecial
const previewMode = Sounds.previewMode


// Floating toolbar tools state
const toolsExpanded = ref(false)


onMounted(() => {
    Sounds.createSynth(synthType.value)
})


function playSpecificNote(note: Sounds.SequenceItem, synthT?: Sounds.SynthType, idx?: number, jump = true) {
    if (jump) {
        if (typeof idx === 'number') {
            Sounds.jumpingIndex.value = idx
            setTimeout(() => {
                if (Sounds.jumpingIndex.value === idx) Sounds.jumpingIndex.value = null
            }, Sounds.jumpDuration)
        }
        if (
            typeof note === 'string' && Sounds.notes.includes(note as Sounds.Note)) {
            jumpingNote.value = note as Sounds.Note
            setTimeout(() => {
                if (jumpingNote.value === note) jumpingNote.value = null
            }, Sounds.jumpDuration)
        }
    }
    if (note === 'Silent' || note === 'Hold') return
    const t = synthT ?? synthType.value
    void Tone.start()
    let s = Sounds.synthMap[t]
    if (!s) {
        s = createSynthReturn(t)
        Sounds.synthMap[t] = s
    }
    s.triggerAttackRelease(note as Sounds.Note, '8n')
}

// returns new synth and sets it toDestination
function createSynthReturn(type: Sounds.SynthType): Tone.AMSynth | Tone.FMSynth | Tone.DuoSynth | Tone.MonoSynth | Tone.Synth {
    switch (type) {
        case 'AMSynth': return new Tone.AMSynth().toDestination()
        case 'FMSynth': return new Tone.FMSynth().toDestination()
        case 'DuoSynth': return new Tone.DuoSynth().toDestination()
        case 'MonoSynth': return new Tone.MonoSynth().toDestination()
        default: return new Tone.Synth().toDestination()
    }
}

</script>

<style>
@keyframes jump {
    0% {
        transform: translateY(0);
    }

    20% {
        transform: translateY(-14px);
    }

    35% {
        transform: translateY(-11px);
    }

    55% {
        transform: translateY(2px);
    }

    70% {
        transform: translateY(-6px);
    }

    90% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(0);
    }
}

.jumping {
    animation: jump 0.25s cubic-bezier(.39, .69, .3, 1.46);
}
</style>
