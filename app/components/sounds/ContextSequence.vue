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
        class="px-4 py-2 md:px-2 md:py-0.5 md:group-data-[touch='true']:px-4 md:group-data-[touch='true']:py-2 rounded border text-xs select-none transition-transform cursor-move bg-transparent"
        :class="[chipClass(element), { jumping: isChipJumping(index) }]"
        @click="previewMode ? handlePreviewNote(element, index) : handleRemoveNote(index)"
        @contextmenu.prevent="handlePreviewNote(element, index)" type="button"
        :title="'Drag to reorder | Left click: remove | Right click: preview'">
        {{ renderItem(element) }}
      </button>
    </VueDraggable>
    <Flex column v-if="isSelected" class="items-center justify-center">
      <SoundsNotes />
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
import { reactive, inject } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import SoundsContextTools from './SoundsContextTools.vue'
import * as Sounds from '~/utils/sounds/sounds';
import { arraysEqual } from '~/utils/arrays';

const previewMode = Sounds.previewMode

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
  if (sn.note === 'Hold') return 'Hold'
  if (sn.note === 'Silent') return 'Rest'
  return `${sn.note}`
}
function chipClass(sn: SequenceNote) {
  if (sn.note === 'Hold') return 'bg-amber-950/30 border-amber-600/50 text-amber-200'
  if (sn.note === 'Silent') return 'bg-neutral-900/30 border-neutral-600/50 text-neutral-200'
  return 'bg-primary/10 border-primary/50 text-primary-foreground/90'
}

// Chip interactions
function handlePreviewNote(sn: SequenceNote, i: number) {
  Sounds.contextPreview(sn.note, sn.synthType, [...props.path, props.index], i)
  triggerLocalJump(i)
}
function handleRemoveNote(i: number) {
  Sounds.contextRemove([...props.path, props.index], i)
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