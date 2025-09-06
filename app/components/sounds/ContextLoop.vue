<template>
  <div class="flex flex-col gap-2 rounded-md border border-control-primary bg-card p-3 shadow-sm">
    <div class="flex flex-col lg:flex-row items-center justify-between">
      <div class="font-semibold">Repeat {{ stmt.iterations }} time{{ stmt.iterations === 1 ? '' : 's' }}</div>
      <div class="flex items-center gap-2">
        <Button size="xs" variant="control" @click="$emit('update-iterations', index, Math.max(1, stmt.iterations - 1))" :disabled="stmt.iterations <= 1">-</Button>
        <Button size="xs" variant="control" @click="$emit('update-iterations', index, stmt.iterations + 1)">+</Button>
        <SoundsContextTools
          @duplicate="$emit('duplicate', index)"
          @wrap-in-loop="$emit('wrap-in-loop', index)"
          @remove="$emit('remove', index)"
        />
      </div>
    </div>
    <div class="pl-3 border-l-2 border-control-primary/60">
      <ContextBlocks :statements="stmt.statements" :path="[...path, index]" @update:statements="v => $emit('update-nested', index, v)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContextBlocks from './ContextBlocks.vue'
import SoundsContextTools from './SoundsContextTools.vue'

export type LoopStatement = { kind: 'loop'; iterations: number; statements: any[] }

const props = defineProps<{
  index: number
  path: number[]
}>()
const stmt = defineModel<LoopStatement>('stmt', { required: true })


const emit = defineEmits<{
  (e: 'update-iterations', index: number, value: number): void
  (e: 'update-nested', index: number, value: any[]): void
  (e: 'remove', index: number): void
  (e: 'duplicate', index: number): void
  (e: 'wrap-in-loop', index: number): void
}>()
</script>

<style scoped>
</style>
