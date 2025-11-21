<script setup lang="ts">
import src from '../assets/SimplyToolsIcon.png';
defineProps<{ alt?: string }>();
</script>
<template>
    <img :src :alt="alt ?? ''" />
</template>