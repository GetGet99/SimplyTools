<template>
    <Feature category="sounds" tool="Make your own sounds!">
        <Flex column class="gap-8 group" :data-touch="toolsExpanded">
            <Flex column class="items-center gap-6 w-full p-8">
                <div class="mb-4">Make Sounds! Add notes! Make loops! And listen!</div>
                <!-- Playing Context controls -->
                <div class="w-full mb-6">
                    <SoundsContextBlocks v-model:statements="playingContext.statements" />
                </div>
                <div class="gap-2 items-center">
                    <Button v-if="!isPlaying" class="pl-1.25 flex gap-1" @click="Sounds.playContext"
                        :disabled="playingContext.statements.length === 0">
                        <Icon :icon=PlayIcon alt="" />
                        Play Sound
                    </Button>
                    <Button v-else variant="control" title="Stop Playback" class="pl-1.25 flex gap-1"
                        @click="Sounds.stopSequence">
                        <Icon :icon=StopIcon alt="" />
                        Stop Sound
                    </Button>
                    <Button class="flex gap-1" @click="Sounds.exportAsWAV()">
                        Export
                    </Button>
                </div>
            </Flex>
        </Flex>

        <!-- Floating tools using Tailwind & Button.vue component -->
        <Flex
            class="fixed right-6 bottom-7 z-40 gap-2 items-end backdrop-blur-lg p-2 border rounded-lg border-border-control-primary">
            <Flex v-show="toolsExpanded" class="gap-2 items-center shadow-lg">
                <Button :variant="previewMode ? 'accent' : 'control'"
                    class="flex items-center gap-1 text-base min-w-[40px]" @click="previewMode = !previewMode"
                    :aria-pressed="previewMode">
                    <Icon :icon=PlayIcon alt="Play Sound" />
                    Tap to Preview Notes
                </Button>
                <!-- Add more tool buttons here -->
            </Flex>
            <Button :variant="toolsExpanded ? 'accent' : 'control'" @click="toolsExpanded = !toolsExpanded"
                :aria-label="toolsExpanded ? 'Close Tools' : 'Open Tools'" class="pl-1.25 flex gap-1">
                <Icon :icon="TouchIcon" alt="" />
                Touchscreen Compatibility
            </Button>
            <Flex class="gap-2">
                <Button v-if="!isPlaying" class="pl-1.25 flex gap-1 border-accent-primary" @click="Sounds.playContext"
                    :disabled="playingContext.statements.length === 0">
                    <Icon :icon=PlayIcon alt="Play Sound" />
                    Play
                </Button>
                <Button v-else variant="control" title="Stop Playback" class="pl-1.25 flex gap-1"
                    @click="Sounds.stopSequence">
                    <Icon :icon=StopIcon alt="Stop Playback" />
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
        </template>
    </Feature>
</template>

<script setup lang="ts">
import { Apps } from '~/utils/pages/app';
usePageInfo(Apps.pages.find(x => x.path === 'sounds'))
import { ref, computed, provide } from 'vue'
import * as Tone from 'tone'
import * as Sounds from '~/utils/sounds/sounds';
import PlayIcon from '@fluentui/svg-icons/icons/play_24_regular.svg?raw'
import StopIcon from '@fluentui/svg-icons/icons/stop_24_regular.svg?raw'
import TouchIcon from '@fluentui/svg-icons/icons/hand_point_24_regular.svg?raw'
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

// function addNoteToSequence(note: Sounds.SequenceItem) {
//     sequence.value.push({ note, synthType: synthType.value, id: crypto.randomUUID() })
// }

// function removeNote(idx: number) {
//     sequence.value.splice(idx, 1)
// }

// async function playSequence() {
//     await Tone.start();

//     if (isPlaying.value) {
//         stopSequence();
//     }

//     Tone.Transport.cancel();
//     scheduledIds = [];

//     const step = Tone.Time('8n').toSeconds();
//     let offset = 0;

//     isPlaying.value = true;

//     for (let i = 0; i < sequence.value.length; i++) {
//         const { note, synthType: nSynthType } = sequence.value[i]!;
//         const idx = i;

//         // Always jump for this step (Silent/Hold/Note)
//         const id = Tone.getTransport().schedule((time) => {
//             Tone.getDraw().schedule(() => {
//                 jumpingIndex.value = idx;
//                 setTimeout(() => {
//                     if (jumpingIndex.value === idx) jumpingIndex.value = null;
//                 }, jumpDuration);
//             }, time);

//             // Only play sound if this is a note
//             if (note !== 'Silent' && note !== 'Hold') {
//                 // Find how many Holds immediately follow this note
//                 let holdCount = 0;
//                 let j = i + 1;
//                 while (j < sequence.value.length && sequence.value[j]?.note === 'Hold') {
//                     holdCount++;
//                     j++;
//                 }
//                 const duration = step * (1 + holdCount);

//                 let s = synthMap[nSynthType];
//                 if (!s) {
//                     s = createSynthReturn(nSynthType);
//                     synthMap[nSynthType] = s;
//                 }
//                 const n = note as Sounds.Note;
//                 s.triggerAttackRelease(n, duration, time);
//             }
//         }, offset);
//         scheduledIds.push(id);
//         offset += step;
//     }

//     // Automatic stop at the end
//     const endId = Tone.getTransport().schedule(() => {
//         stopSequence();
//     }, offset);
//     scheduledIds.push(endId);

//     Tone.Transport.start();
// }


function handleNoteKeyPreview(note: Sounds.Note) {
    playSpecificNote(note)
}
function handleSpecialPreview(s: Sounds.Special) {
    jumpingSpecial.value = s
    setTimeout(() => {
        if (jumpingSpecial.value === s) jumpingSpecial.value = null
    }, Sounds.jumpDuration)
    // no sound for silent/hold
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
