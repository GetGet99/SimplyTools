<template>
  <Flex column class="gap-3">
    <ContextInsertBar :index=0 />

    <div v-if="!statements.length" class="text-xs text-muted-foreground">
      No statements in context.
    </div>

    <template v-for="(stmt, idx) in statements" :key="idx">
      <ContextSequence v-if="stmt.kind === 'sequence'" v-model:stmt="(stmt as SequenceStatement)" :index="idx"
        :path :is-selected="isSequenceSelected(idx)" />

      <ContextLoop v-else v-model:stmt="(stmt as LoopStatement)" :index="idx" :path />

      <ContextInsertBar :index="idx + 1" />
    </template>
  </Flex>
</template>

<script setup lang="ts">
import ContextSequence from './ContextSequence.vue'
import ContextLoop from './ContextLoop.vue'
import ContextInsertBar from './ContextInsertBar.vue'
import { selectedSequencePath } from '~/utils/sounds/sounds'
import type { LoopStatement, SequenceStatement, Statement } from '~/utils/sounds/sounds'

export type ContextBlockAPIs = {
  selectSequenceAt(index: number): void
  removeAt(index: number): void
  duplicateAt(index: number): void
  wrapInLoopAt(index: number): void
  insertAt(index: number, stmt: Statement): void
  updateAt<T extends Statement>(index: number, updateFn: (stmt: T) => T): void
}
export function useContextBlockAPI() {
  return inject<ContextBlockAPIs>('ContextBlockAPIs')!
}


// keep name for recursion usage in ContextLoop
defineOptions({ name: 'ContextBlocks' })

// Types
const props = withDefaults(defineProps<{
  statements: Statement[]
  path?: number[]
}>(), { path: () => [] })

const emit = defineEmits<{ (e: 'update:statements', value: Statement[]): void }>()

function insertAt(index: number, stmt: Statement) {
  const next = props.statements.slice()
  next.splice(index, 0, stmt)
  emit('update:statements', next)
}

function updateAt<T extends Statement>(index: number, updateFn: (stmt: T) => T) {
  const next = props.statements.slice()
  next[index] = updateFn(next[index]! as T)
  emit('update:statements', next)
}

function removeAt(index: number) {
  const next = props.statements.slice()
  next.splice(index, 1)
  emit('update:statements', next)
}

function duplicateAt(index: number) {
  const next = props.statements.slice()
  const s = next[index]
  if (!s) return
  // deep clone
  const dup = deepClone(s)
  next.splice(index + 1, 0, dup)
  emit('update:statements', next)
}
function deepClone(stmt: Statement) {
  let newStmt: Statement = { ...stmt }
  if (stmt.kind === 'sequence') {
    const seq = stmt as SequenceStatement
    // clone sequence
    (newStmt as SequenceStatement).sequence = seq.sequence.map(x => ({ ...x, id: crypto.randomUUID() }))
  }
  else if (stmt.kind === 'loop') {
    const loop = stmt as LoopStatement
    // clone sequence
    (newStmt as LoopStatement).statements = loop.statements.map(x => ({ ...x, id: crypto.randomUUID() }))
  }
  return newStmt
}

function wrapInLoopAt(index: number) {
  const next = props.statements.slice()
  const s = next[index]
  if (!s) return
  const wrapped: LoopStatement = { kind: 'loop', iterations: 2, statements: [s as any] }
  next.splice(index, 1, wrapped as any)
  emit('update:statements', next)
}

function selectSequenceAt(stmtIndex: number) {
  if (!arraysEqual(selectedSequencePath.value ?? undefined, [...(props.path || []), stmtIndex]))
    selectedSequencePath.value = [...(props.path || []), stmtIndex]
  else
    selectedSequencePath.value = null
}

function isSequenceSelected(stmtIndex: number) {
  const p = selectedSequencePath.value
  if (!p) return false
  return arraysEqual(p, [...(props.path || []), stmtIndex])
}

provide('ContextBlockAPIs', {
  selectSequenceAt,
  removeAt,
  duplicateAt,
  wrapInLoopAt,
  insertAt,
  updateAt,
} satisfies ContextBlockAPIs)
</script>