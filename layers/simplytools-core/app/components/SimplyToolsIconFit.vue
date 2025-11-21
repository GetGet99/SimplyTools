<script setup lang="ts">
import src from '../assets/SimplyToolsIcon_fit.png';
defineProps<{ alt?: string }>();
</script>
<template>
    <img :src :alt="alt ?? ''" />
</template>