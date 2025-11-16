<template>
  <Flex class="items-center justify-center gap-2 my-1">
    Add
    <Button class="text-xs" @click="parent.insertAt(index, createSequenceStatement())">Notes</Button>
    <Button class="text-xs" variant="regular" @click="parent.insertAt(index, createLoopStatement())">Loop</Button>
    <!-- Potentially add remove-below later -->
  </Flex>
</template>

<script setup lang="ts">
import type { LoopStatement, SequenceStatement } from '~/utils/sounds/sounds';
import { useContextBlockAPI } from './ContextBlocks.vue';

const parent = useContextBlockAPI()
const props = defineProps<{ index: number }>()


function createSequenceStatement(): SequenceStatement { return { kind: 'sequence', sequence: [] } }
function createLoopStatement(): LoopStatement { return { kind: 'loop', iterations: 2, statements: [] } }
</script>

<style scoped>
</style>
