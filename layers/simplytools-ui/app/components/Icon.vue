<script setup lang="ts">
    defineProps<{ icon: string, alt: string }>()
</script>
<template>
    <span v-html="icon" class="fill-current" role="img" :aria-label=alt />
</template>