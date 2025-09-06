<template>
  <div class="flex items-center gap-2">
    <Button size="xs" variant="control" @click="$emit('duplicate')">Duplicate</Button>
    <Button size="xs" variant="control" @click="$emit('wrap-in-loop')">Wrap in Loop</Button>
    <Button size="xs" variant="control" @click="$emit('remove')">Remove</Button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'duplicate'): void
  (e: 'wrap-in-loop'): void
  (e: 'remove'): void
}>()
</script>

<style scoped>
</style>
