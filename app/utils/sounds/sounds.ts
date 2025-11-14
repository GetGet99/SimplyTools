import * as Tone from 'tone'
export const synthTypes = ['Synth', 'AMSynth', 'FMSynth', 'DuoSynth', 'MonoSynth'] as const
export type SynthType = typeof synthTypes[number]

export const notes = [
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
    'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
    'C8', 'C#8', 'D8', 'D#8', 'E8', 'F8', 'F#8', 'G8', 'G#8', 'A8', 'A#8', 'B8',
    'C9', 'C#9', 'D9', 'D#9', 'E9', 'F9', 'F#9', 'G9', 'G#9', 'A9', 'A#9', 'B9',
    'C10', 'C#10', 'D10', 'D#10', 'E10', 'F10', 'F#10', 'G10', 'G#10', 'A10', 'A#10', 'B10'
] as const
export type Note = typeof notes[number]
export type Special = 'Silent' | 'Hold'
export type SequenceNote = { note: SequenceItem; synthType: SynthType, id: ReturnType<typeof crypto.randomUUID>, length?: number }
export type SequenceItem = Note | Special
export type SequenceStatement = { kind: 'sequence'; sequence: SequenceNote[] }
export type LoopStatement = { kind: 'loop'; iterations: number; statements: Statement[] }
export type Statement = SequenceStatement | LoopStatement
export type PlayingContext = { statements: Statement[] }

export const synthType: Ref<SynthType> = ref('Synth')
export const playingContext: Ref<PlayingContext> = ref({
    statements: [
        {
            kind: 'sequence', sequence:
                [
                    { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID(), length: 2 },
                    { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID(), length: 2 },
                    { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'G4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'C4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'D4', synthType: 'Synth', id: crypto.randomUUID() },
                    { note: 'E4', synthType: 'Synth', id: crypto.randomUUID(), length: 4 },
                    { note: 'F4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'F4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'F4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'F4', synthType: 'Synth', id: crypto.randomUUID() },
                    { note: 'F4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID(), length: 2 },
                    { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'D4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'D4', synthType: 'Synth', id: crypto.randomUUID() }, { note: 'E4', synthType: 'Synth', id: crypto.randomUUID() },
                    { note: 'D4', synthType: 'Synth', id: crypto.randomUUID(), length: 2 }, { note: 'G4', synthType: 'Synth', id: crypto.randomUUID() }
                ]
        }
    ]
})
export const jumpDuration = 250 // ms
export const jumpingIndex = ref<number | null>(null)
export const selectedSequencePath = ref<number[] | null>(null)
export const isPlaying: Ref<boolean> = ref(false)
export const jumpingNote = ref<Note | null>(null)
export const jumpingSpecial = ref<Special | null>(null)
// Context blocks highlight state
export const highlightPath = ref<number[]>([])
export const highlightIndex = ref<number | null>(null)
export const previewMode = ref(false)
const stepSeconds = import.meta.client ? Tone.Time('8n').toSeconds() : 0

function createSynthReturn(type: SynthType): Tone.AMSynth | Tone.FMSynth | Tone.DuoSynth | Tone.MonoSynth | Tone.Synth {
    switch (type) {
        case 'AMSynth': return new Tone.AMSynth().toDestination()
        case 'FMSynth': return new Tone.FMSynth().toDestination()
        case 'DuoSynth': return new Tone.DuoSynth().toDestination()
        case 'MonoSynth': return new Tone.MonoSynth().toDestination()
        default: return new Tone.Synth().toDestination()
    }
}
export function playSpecificNote(note: SequenceItem, synthT?: SynthType, idx?: number, jump = true, length?: number) {
    if (jump) {
        if (typeof idx === 'number') {
            jumpingIndex.value = idx
            setTimeout(() => {
                if (jumpingIndex.value === idx) jumpingIndex.value = null
            }, jumpDuration)
        }
        if (
            typeof note === 'string' && notes.includes(note as Note)) {
            jumpingNote.value = note as Note
            setTimeout(() => {
                if (jumpingNote.value === note) jumpingNote.value = null
            }, jumpDuration)
        }
    }
    if (note === 'Silent' || note === 'Hold') return
    const t = synthT ?? synthType.value
    void Tone.start()
    let s = synthMap[t]
    if (!s) {
        s = createSynthReturn(t)
        synthMap[t] = s
    }
    const noteLength = length ?? 1
    const duration = stepSeconds * noteLength
    s.triggerAttackRelease(note as Note, duration)
}
export let synth: Tone.AMSynth | Tone.FMSynth | Tone.DuoSynth | Tone.MonoSynth | Tone.Synth | null = null
// Helper to memoize synth per type
export const synthMap: Partial<Record<SynthType, Tone.AMSynth | Tone.FMSynth | Tone.DuoSynth | Tone.MonoSynth | Tone.Synth>> = {}

export function createSynth(type: SynthType) {
    if (synth) synth.dispose()
    switch (type) {
        case 'AMSynth': synth = new Tone.AMSynth(); break
        case 'FMSynth': synth = new Tone.FMSynth(); break
        case 'DuoSynth': synth = new Tone.DuoSynth(); break
        case 'MonoSynth': synth = new Tone.MonoSynth(); break
        default: synth = new Tone.Synth(); break
    }
    synth.toDestination()
}

let scheduledIds: number[] = []

export async function playContext() {
    if (!import.meta.client) return

    await Tone.start()

    if (isPlaying.value) {
        stopSequence()
    }

    Tone.Transport.cancel()
    scheduledIds = []

    isPlaying.value = true

    const endOffset = scheduleStatements(playingContext.value.statements, 0, [])

    const endId = Tone.getTransport().schedule(() => {
        stopSequence()
    }, endOffset)
    scheduledIds.push(endId)

    Tone.Transport.start()
}

export function stopSequence() {
    // Clear scheduled events and stop the transport
    scheduledIds.forEach(id => Tone.getTransport().clear(id))
    scheduledIds = []
    Tone.Transport.stop()
    isPlaying.value = false
    // clear block highlights
    highlightPath.value = []
    highlightIndex.value = null
}
function scheduleStatements(stmts: Statement[], startOffset: number, path: number[], transport?: typeof Tone.Transport): number {
    let offset = startOffset
    for (let sIdx = 0; sIdx < stmts.length; sIdx++) {
        const stmt = stmts[sIdx]!
        const nextPath = [...path, sIdx]
        if (stmt.kind === 'sequence') {
            const seqSnapshot = stmt.sequence.slice()
            offset = scheduleSequenceEvents(seqSnapshot, offset, (idx, time) => {
                if (!transport)
                    Tone.getDraw().schedule(() => {
                        highlightPath.value = nextPath
                        highlightIndex.value = idx
                        console.log(time)
                        setTimeout(() => {
                            if (highlightIndex.value === idx && arraysEqual(highlightPath.value, nextPath)) {
                                highlightIndex.value = null
                                highlightPath.value = []
                            }
                        }, jumpDuration)
                    }, time)
            }, transport)
        } else if (stmt.kind === 'loop') {
            const iterations = Math.max(1, Math.floor(stmt.iterations || 1))
            for (let i = 0; i < iterations; i++) {
                offset = scheduleStatements(stmt.statements, offset, nextPath, transport)
            }
        }
    }
    return offset
}

function scheduleSequenceEvents(seq: SequenceNote[], startOffset: number, perStep?: (idx: number, time: number) => void, transport?: typeof Tone.Transport): number {
    let offset = startOffset
    for (let i = 0; i < seq.length; i++) {
        const { note, synthType: nSynthType, length } = seq[i]!
        const idx = i
        const noteLength = length ?? 1
        const id = (transport ?? Tone.getTransport()).schedule((time) => {
            if (!transport && perStep) {
                Tone.getDraw().schedule(() => {
                    perStep(idx, time)
                }, time)
            }
            if (note !== 'Silent' && note !== 'Hold') {
                // Support legacy Hold notes: count consecutive Holds after this note
                let holdCount = 0
                let j = idx + 1
                while (j < seq.length && seq[j]?.note === 'Hold') {
                    holdCount++
                    j++
                }
                // Use length property if explicitly set (including 0.5), otherwise fall back to holdCount for backward compatibility
                const effectiveLength = (length !== undefined && length !== 1) ? length : (1 + holdCount)
                const duration = stepSeconds * effectiveLength
                let s = synthMap[nSynthType]
                if (!s) {
                    s = createSynthReturn(nSynthType)
                    synthMap[nSynthType] = s
                }
                const n = note as Note
                s.triggerAttackRelease(n, duration, time)
            }
        }, offset)
        if (!transport)
            scheduledIds.push(id)
        // Advance offset by the note's length (or 1 if not specified)
        offset += stepSeconds * noteLength
    }
    return offset
}

// Get a statement by path
function getStatementByPath(path: number[]): Statement | undefined {
    let stmts = playingContext.value.statements
    let current: Statement | undefined
    for (let i = 0; i < path.length; i++) {
        current = stmts[path[i]!]
        if (!current) return undefined
        if (i < path.length - 1) {
            if (current.kind !== 'loop') return undefined
            stmts = current.statements
        }
    }
    return current
}

export function contextPreview(note: string, synthType: SynthType, path: number[], index: number, length?: number) {
    // schedule highlight on Draw to sync with RAF
    Tone.getDraw().schedule(() => {
        highlightPath.value = path
        highlightIndex.value = index
        setTimeout(() => {
            if (highlightIndex.value === index && arraysEqual(highlightPath.value, path)) {
                highlightIndex.value = null
                highlightPath.value = []
            }
        }, jumpDuration)
    }, Tone.now())

    if (note === 'Hold' || note === 'Silent') return
    playSpecificNote(note as Note, synthType, undefined, true, length)
}
export function contextRemove(path: number[], index: number) {
    const stmt = getStatementByPath(path)
    if (!stmt || stmt.kind !== 'sequence') return
    stmt.sequence.splice(index, 1)
}

export function contextDuplicate(path: number[], index: number) {
    const stmt = getStatementByPath(path)
    if (!stmt || stmt.kind !== 'sequence') return
    const note = stmt.sequence[index]
    if (!note) return
    // Create a duplicate with a new ID
    const duplicate: SequenceNote = {
        ...note,
        id: crypto.randomUUID()
    }
    // Insert at the next index
    stmt.sequence.splice(index + 1, 0, duplicate)
    return index + 1 // Return the new index
}
export function addItemToSelected(n: SequenceItem) {
    if (!selectedSequencePath.value) return
    const stmt = getStatementByPath(selectedSequencePath.value)
    if (!stmt || stmt.kind !== 'sequence') return
    stmt.sequence.push({ note: n, synthType: synthType.value, id: crypto.randomUUID(), length: 1 })
}

export function adjustNoteLength(path: number[], index: number, delta: number) {
    const stmt = getStatementByPath(path)
    if (!stmt || stmt.kind !== 'sequence') return
    const note = stmt.sequence[index]
    if (!note) return
    const currentLength = note.length || 1
    const isHoldNote = note.note === 'Hold'
    
    let newLength: number
    
    // Special transition: 1 <-> 0.5
    if (currentLength === 1 && delta < 0) {
        newLength = 0.5
    } else if (currentLength === 0.5 && delta > 0) {
        newLength = 1
    } else if (currentLength === 0.5 && delta < 0) {
        // Stay at minimum (0.5)
        newLength = 0.5
    } else if (currentLength < 1) {
        // If somehow below 0.5, clamp to 0.5
        newLength = 0.5
    } else {
        // For Hold notes, allow fractional increments (0.5 steps)
        // For other notes, only integer steps
        if (isHoldNote) {
            newLength = Math.max(0.5, currentLength + (delta * 0.5))
            // Round to nearest 0.5 for cleaner values
            newLength = Math.round(newLength * 2) / 2
        } else {
            // For values >= 1, adjust by integer steps
            newLength = Math.max(0.5, Math.round(currentLength + delta))
        }
        // If we end up at 1, we can keep it as 1 (will be stored as undefined)
    }
    
    // Store as undefined if 1 (default), otherwise store the value
    note.length = newLength === 1 ? undefined : newLength
}

export function adjustNotePitch(path: number[], index: number, direction: number) {
    const stmt = getStatementByPath(path)
    if (!stmt || stmt.kind !== 'sequence') return
    const note = stmt.sequence[index]
    if (!note) return
    
    // Only adjust pitch for actual notes (not Silent or Hold)
    if (note.note === 'Silent' || note.note === 'Hold') return
    
    const currentNote = note.note as Note
    const currentIndex = notes.indexOf(currentNote)
    
    if (currentIndex === -1) return
    
    const newIndex = currentIndex + direction
    
    // Check bounds
    if (newIndex >= 0 && newIndex < notes.length) {
        note.note = notes[newIndex] as Note
    }
}

if (import.meta.client) {
    watch(synthType, (type) => {
        createSynth(type)
    })
}
// Utility to convert an AudioBuffer to WAV
function audioBufferToWav(buffer: Tone.ToneAudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels
    const length = buffer.length * numOfChan * 2 + 44
    const bufferArray = new ArrayBuffer(length)
    const view = new DataView(bufferArray)

    let channels: Float32Array[] = []
    let i: number
    let sample: number
    let offset = 0
    let pos = 0

    // write WAVE header
    setUint32(0x46464952) // "RIFF"
    setUint32(length - 8) // file length - 8
    setUint32(0x45564157) // "WAVE"

    setUint32(0x20746d66) // "fmt " chunk
    setUint32(16) // length = 16
    setUint16(1) // PCM (uncompressed)
    setUint16(numOfChan)
    setUint32(buffer.sampleRate)
    setUint32(buffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
    setUint16(numOfChan * 2) // block-align
    setUint16(16) // 16-bit (hardcoded in this example)

    setUint32(0x61746164) // "data" - chunk
    setUint32(length - pos - 4) // chunk length

    // write interleaved data
    for (i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i))
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i]![offset]!)) // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
            view.setInt16(pos, sample, true)
            pos += 2
        }
        offset++
    }

    return new Blob([bufferArray], { type: "audio/wav" })

    function setUint16(data: number) {
        view.setUint16(pos, data, true)
        pos += 2
    }

    function setUint32(data: number) {
        view.setUint32(pos, data, true)
        pos += 4
    }
}

export async function exportAsWAV(): Promise<Blob> {
    // cleanup any previous playback
    stopSequence()
    // figure out how long your piece lasts
    const duration = scheduleStatements(playingContext.value.statements, 0, []) + 1
    // cleanup playback
    stopSequence()

    // Render offline
    const buffer = await Tone.Offline(async ({ transport }) => {
        for (const k of Object.keys(synthMap)) {
            synthMap[k as SynthType]?.dispose()
            delete synthMap[k as SynthType]
        }
        for (const k of synthTypes) {
            synthMap[k] = createSynthReturn(k)
        }
        // schedule just like in playContext, but no UI highlights
        scheduleStatements(playingContext.value.statements, 0, [], transport)
        transport.start()
    }, duration)
    for (const k of Object.keys(synthMap)) {
        synthMap[k as SynthType]?.dispose()
        delete synthMap[k as SynthType]
    }

    // Convert to WAV
    const wavBlob = audioBufferToWav(buffer)

    // Optionally, trigger a download in the browser:
    const url = URL.createObjectURL(wavBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.wav"
    a.click()
    URL.revokeObjectURL(url)

    return wavBlob
}