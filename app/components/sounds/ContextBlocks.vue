<template>
  <Flex column class="gap-3">
    <ContextInsertBar :index="0" @insert-sequence="i => insertAt(i, createSequenceStatement())"
      @insert-loop="i => insertAt(i, createLoopStatement())" />

    <div v-if="!statements.length" class="text-xs text-muted-foreground">
      No statements in context.
    </div>

    <template v-for="(stmt, idx) in statements" :key="idx">
      <ContextSequence v-if="stmt.kind === 'sequence'" v-model:stmt="(stmt as SequenceStatement)" :index="idx"
        :path="path" :is-selected="isSequenceSelected(idx)" @select="selectSequence" @remove="removeAt"
        @duplicate="duplicateAt" @wrap-in-loop="wrapInLoopAt" />

      <ContextLoop v-else v-model:stmt="(stmt as LoopStatement)" :index="idx" :path="path"
        @update-iterations="updateIterations" @update-nested="updateNestedStatements" @remove="removeAt"
        @duplicate="duplicateAt" @wrap-in-loop="wrapInLoopAt" />

      <ContextInsertBar :index="idx + 1" @insert-sequence="i => insertAt(i, createSequenceStatement())"
        @insert-loop="i => insertAt(i, createLoopStatement())" />
    </template>
  </Flex>
</template>

<script setup lang="ts">
import ContextSequence, { type SequenceStatement } from './ContextSequence.vue'
import ContextLoop, { type LoopStatement } from './ContextLoop.vue'
import ContextInsertBar from './ContextInsertBar.vue'
import { selectedSequencePath } from '~/utils/sounds/sounds'
import type { Statement } from '~/utils/sounds/sounds'

// keep name for recursion usage in ContextLoop
defineOptions({ name: 'ContextBlocks' })

// Types
const props = withDefaults(defineProps<{
  statements: Statement[]
  path?: number[]
}>(), { path: () => [] })

const emit = defineEmits<{ (e: 'update:statements', value: Statement[]): void }>()

function createSequenceStatement(): SequenceStatement { return { kind: 'sequence', sequence: [] } }
function createLoopStatement(): LoopStatement { return { kind: 'loop', iterations: 2, statements: [] } }

function insertAt(index: number, stmt: Statement) {
  const next = props.statements.slice()
  next.splice(index, 0, stmt)
  emit('update:statements', next)
}

function removeAt(index: number) {
  const next = props.statements.slice()
  next.splice(index, 1)
  emit('update:statements', next)
}

function updateIterations(index: number, value: number) {
  const next = props.statements.slice()
  const s = next[index]
  if (!s || s.kind !== 'loop') return
  next[index] = { ...s, iterations: Math.max(1, Math.floor(value || 1)) }
  emit('update:statements', next)
}

function updateNestedStatements(index: number, child: Statement[]) {
  const next = props.statements.slice()
  const s = next[index]
  if (!s || s.kind !== 'loop') return
  next[index] = { ...s, statements: child }
  emit('update:statements', next)
}

function duplicateAt(index: number) {
  const next = props.statements.slice()
  const s = next[index]
  if (!s) return
  const dup = s.kind === 'sequence'
    ? { kind: 'sequence', sequence: s.sequence.map(n => ({ ...n })) }
    : { kind: 'loop', iterations: s.iterations, statements: JSON.parse(JSON.stringify(s.statements)) }
  next.splice(index + 1, 0, dup as Statement)
  emit('update:statements', next)
}

function wrapInLoopAt(index: number) {
  const next = props.statements.slice()
  const s = next[index]
  if (!s) return
  const wrapped: LoopStatement = { kind: 'loop', iterations: 2, statements: [s as any] }
  next.splice(index, 1, wrapped as any)
  emit('update:statements', next)
}

function selectSequence(stmtIndex: number) {
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
</script>