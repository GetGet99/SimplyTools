<template>
  <Flex column class="gap-2 rounded-md border border-control-primary bg-card p-3 shadow-sm">
    <Flex column class="lg:flex-row items-center justify-between">
      <Flex class="gap-2">
        <div class="font-semibold text-nowrap">Play Notes</div>
        <div v-if="!previewMode" class="italic">Tap/Left click to remove. Right click to preview notes.</div>
        <div v-else class="italic">Tap/Left click to preview notes.</div>
      </Flex>
      <Flex class="items-center gap-2">
        <Button size="xs" @click="$emit('select', index)">{{ isSelected ? 'Hide Keyboard' : 'Add Notes' }}</Button>
        <SoundsContextTools @duplicate="$emit('duplicate', index)" @wrap-in-loop="$emit('wrap-in-loop', index)"
          @remove="$emit('remove', index)" />
      </Flex>
    </Flex>
    <!-- <Flex class="mt-1 flex-wrap gap-1">
      <button v-for="(sn, i) in stmt.sequence" :key="i"
        class="px-2 py-0.5 rounded border text-xs select-none transition-transform cursor-pointer"
        :class="[chipClass(sn), { jumping: isChipJumping(i) }]" @click.stop="handleRemoveNote(i)"
        @contextmenu.prevent.stop="handlePreviewNote(sn, i)" :title="'Left click: remove | Right click: preview'">
        {{ renderItem(sn) }}
      </button>
    </Flex> -->
    <VueDraggable v-model="stmt.sequence" tag="div" class="mt-1 flex flex-wrap gap-1 bg-transparent" :animation="150">
      <button v-for="(element, index) in stmt.sequence" :key="element.id"
        :ref="el => { if (el) buttonRefs[index] = el as HTMLButtonElement }"
        class="px-4 py-2 md:px-2 md:py-0.5 md:group-data-[touch='true']:px-4 md:group-data-[touch='true']:py-2 rounded border text-xs select-none transition-transform cursor-move bg-transparent"
        :class="[chipClass(element), { jumping: isChipJumping(index) }]"
        @mousedown="isMouseInteraction = true"
        @contextmenu.prevent="isMouseInteraction = true; handlePreviewNote(element, index)"
        @click="previewMode ? handlePreviewNote(element, index) : handleRemoveNote(index)"
        @wheel.prevent="handleWheel($event, index)"
        @focus="handleFocus(element, index)"
        @keydown.enter.prevent="previewMode ? handlePreviewNote(element, index) : handleRemoveNote(index)"
        @keydown.delete.prevent="handleRemoveNote(index)"
        @keydown.backspace.prevent="handleRemoveNote(index)"
        @keydown.d.prevent="handleDuplicate(index)"
        @keydown.space.prevent="handlePreviewNote(element, index)"
        @keydown.arrow-left.prevent="handleArrowKey($event, index, -1)"
        @keydown.arrow-right.prevent="handleArrowKey($event, index, 1)"
        @keydown.arrow-up.prevent="handleArrowKeyVertical($event, index, -1)"
        @keydown.arrow-down.prevent="handleArrowKeyVertical($event, index, 1)"
        type="button"
        :title="'Drag to reorder | Left click: remove | Right click: preview | Shift + scroll: adjust length | Tab/Arrows: navigate | Shift+Left/Right: adjust length | Shift+Up/Down: adjust pitch | Alt+Arrows: reorder | D: duplicate | Enter: activate'">
        {{ renderItem(element) }}
      </button>
    </VueDraggable>
    <Flex column v-if="isSelected" class="items-center justify-center">
      <SoundsNotes />
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import SoundsContextTools from './SoundsContextTools.vue'
import * as Sounds from '~/utils/sounds/sounds';
import { arraysEqual } from '~/utils/arrays';

const previewMode = Sounds.previewMode

// Track if focus is from mouse interaction (to avoid playing preview on click)
const isMouseInteraction = ref(false)
// Store refs to button elements for programmatic focus
const buttonRefs = ref<Array<HTMLButtonElement | null>>([])

type SequenceNote = Sounds.SequenceNote
export type SequenceStatement = { kind: 'sequence'; sequence: SequenceNote[] }

const props = defineProps<{
  index: number
  path: number[]
  isSelected: boolean
}>()
const stmt = defineModel<SequenceStatement>('stmt', { required: true })
defineEmits<{
  (e: 'select', index: number): void
  (e: 'remove', index: number): void
  (e: 'duplicate', index: number): void
  (e: 'wrap-in-loop', index: number): void
}>()

const maxPreview = 32

function previewSequence(seq: SequenceNote[]) { return seq.slice(0, maxPreview) }
function renderItem(sn: SequenceNote) {
  const length = sn.length || 1
  let lengthSuffix = ''
  if (length === 0.5) {
    lengthSuffix = ' (1/2)'
  } else if (length > 1) {
    // For fractional values, show as fraction if it's a simple one (e.g., 1.5 -> 3/2)
    if (length % 1 === 0.5) {
      const whole = Math.floor(length)
      const numerator = whole * 2 + 1
      lengthSuffix = ` (${numerator}/2)`
    } else {
      lengthSuffix = ` (${length}x)`
    }
  }
  if (sn.note === 'Hold') return `Hold${lengthSuffix}`
  if (sn.note === 'Silent') return `Rest${lengthSuffix}`
  return `${sn.note}${lengthSuffix}`
}
function chipClass(sn: SequenceNote) {
  if (sn.note === 'Hold') return 'bg-amber-950/30 border-amber-600/50 text-amber-200'
  if (sn.note === 'Silent') return 'bg-neutral-900/30 border-neutral-600/50 text-neutral-200'
  return 'bg-primary/10 border-primary/50 text-primary-foreground/90'
}

// Chip interactions
function handlePreviewNote(sn: SequenceNote, i: number) {
  Sounds.contextPreview(sn.note, sn.synthType, [...props.path, props.index], i, sn.length)
  triggerLocalJump(i)
}
function handleRemoveNote(i: number) {
  Sounds.contextRemove([...props.path, props.index], i)
}
function handleDuplicate(i: number) {
  const newIndex = Sounds.contextDuplicate([...props.path, props.index], i)
  if (newIndex !== undefined) {
    // Focus the newly duplicated note
    nextTick(() => {
      const targetButton = buttonRefs.value[newIndex]
      if (targetButton) {
        targetButton.focus()
      }
    })
  }
}
function handleWheel(event: WheelEvent, i: number) {
  if (event.shiftKey) {
    // Adjust by 1 per scroll step for responsive control
    const delta = event.deltaY > 0 ? -1 : 1
    Sounds.adjustNoteLength([...props.path, props.index], i, delta)
    event.preventDefault()
  }
}
function handleFocus(sn: SequenceNote, i: number) {
  // Only play preview when focused via keyboard navigation (not mouse clicks)
  if (!isMouseInteraction.value) {
    Sounds.contextPreview(sn.note, sn.synthType, [...props.path, props.index], i, sn.length)
    triggerLocalJump(i)
  }
  // Reset flag after a short delay to allow focus event to complete
  setTimeout(() => { isMouseInteraction.value = false }, 0)
}
function handleArrowKey(event: KeyboardEvent, currentIndex: number, direction: number) {
  if (event.altKey) {
    // Alt + Arrow: Reorder notes
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < stmt.value.sequence.length) {
      const sequence = stmt.value.sequence
      const currentNote = sequence[currentIndex]
      const targetNote = sequence[newIndex]
      if (currentNote && targetNote) {
        // Swap the notes
        sequence[currentIndex] = targetNote
        sequence[newIndex] = currentNote
        // Focus the note at its new position
        nextTick(() => {
          const targetButton = buttonRefs.value[newIndex]
          if (targetButton) {
            targetButton.focus()
          }
        })
      }
      event.preventDefault()
    }
  } else if (event.shiftKey) {
    // Shift + Left/Right Arrow: Adjust length
    const delta = direction > 0 ? 1 : -1
    Sounds.adjustNoteLength([...props.path, props.index], currentIndex, delta)
    event.preventDefault()
  } else {
    // Arrow: Navigate to next/previous note
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < stmt.value.sequence.length) {
      nextTick(() => {
        const targetButton = buttonRefs.value[newIndex]
        if (targetButton) {
          targetButton.focus()
        }
      })
      event.preventDefault()
    }
  }
}
function handleArrowKeyVertical(event: KeyboardEvent, currentIndex: number, direction: number) {
  if (event.shiftKey) {
    // Shift + Up/Down Arrow: Adjust note pitch (tone)
    // Up (direction = -1) should increase pitch (forward in array = +1)
    // Down (direction = 1) should decrease pitch (backward in array = -1)
    Sounds.adjustNotePitch([...props.path, props.index], currentIndex, -direction)
    // Play preview of the new note
    const note = stmt.value.sequence[currentIndex]
    if (note && note.note !== 'Silent' && note.note !== 'Hold') {
      Sounds.contextPreview(note.note, note.synthType, [...props.path, props.index], currentIndex, note.length)
      triggerLocalJump(currentIndex)
    }
    event.preventDefault()
  } else {
    // Up/Down Arrow without modifiers: do nothing (or could navigate vertically if needed)
    event.preventDefault()
  }
}

// Jumping effect management
const localJumpKeys = reactive(new Set<string>())
function keyFor(i: number) { return JSON.stringify([...props.path, props.index]) + ':' + i }
function triggerLocalJump(i: number) {
  const k = keyFor(i)
  localJumpKeys.add(k)
  setTimeout(() => { localJumpKeys.delete(k) }, Sounds.jumpDuration)
}
function isChipJumping(i: number) {
  const external = arraysEqual([...props.path, props.index], Sounds.highlightPath.value) && Sounds.highlightIndex.value === i
  const internal = localJumpKeys.has(keyFor(i))
  return external || internal
}
</script>