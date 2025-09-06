<template>
  <div class="flex items-center justify-center gap-2 my-1">
    Add
    <Button class="text-xs" @click="$emit('insert-sequence', index)">Notes</Button>
    <Button class="text-xs" variant="control" @click="$emit('insert-loop', index)">Loop</Button>
    <!-- Potentially add remove-below later -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ index: number }>()
const emit = defineEmits<{
  (e: 'insert-sequence', index: number): void
  (e: 'insert-loop', index: number): void
}>()
</script>

<style scoped>
</style>
