<template>
  <Flex class="items-center gap-2">
    <Button size="xs" variant="regular" @click="parent.duplicateAt(index)">Duplicate</Button>
    <Button size="xs" variant="regular" @click="parent.wrapInLoopAt(index)">Wrap in Loop</Button>
    <Button size="xs" variant="regular" @click="parent.removeAt(index)">Remove</Button>
  </Flex>
</template>

<script setup lang="ts">
import { useContextBlockAPI } from './ContextBlocks.vue';
defineProps<{ index: number }>()
const parent = useContextBlockAPI()
</script>

<style scoped></style>
