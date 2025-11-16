<template>
  <Flex class="gap-2 rounded-md border border-control-primary bg-card p-3 shadow-sm">
    <Flex class="lg:flex-row items-center justify-between">
      <div class="font-semibold">Repeat {{ stmt.iterations }} time{{ stmt.iterations === 1 ? '' : 's' }}</div>
      <Flex class="items-center gap-2">
        <Button size="xs" variant="regular" @click="updateIterations(Math.max(1, stmt.iterations - 1))"
          :disabled="stmt.iterations <= 1">-</Button>
        <Button size="xs" variant="regular" @click="updateIterations(stmt.iterations + 1)">+</Button>
        <SoundsContextTools :index />
      </Flex>
    </Flex>
    <div class="pl-3 border-l-2 border-control-primary/60">
      <ContextBlocks :statements="stmt.statements" :path="[...path, index]"
        @update:statements="statements => parent.updateAt<LoopStatement>(index, stmt => ({ ...stmt, statements }))" />
    </div>
  </Flex>
</template>

<script setup lang="ts">
import type { LoopStatement } from '~/utils/sounds/sounds';
import ContextBlocks, { useContextBlockAPI } from './ContextBlocks.vue'
import SoundsContextTools from './SoundsContextTools.vue'


const parent = useContextBlockAPI()
function updateIterations(value: number) {
  parent.updateAt<LoopStatement>(props.index, stmt => ({ ...stmt, iterations: value }))
}

const props = defineProps<{
  index: number
  path: number[]
}>()
const stmt = defineModel<LoopStatement>('stmt', { required: true })

</script>

<style scoped></style>
