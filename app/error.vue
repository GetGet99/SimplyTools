<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center">
    <h1 class="font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]">{{ error?.statusCode }}</h1>
    <h2 class="font-semibold mb-2 sm:text-3xl text-2xl">{{ error?.statusMessage }}</h2>
    <p class="mb-4 px-2 text-placeholder text-md">{{ error?.message }}</p>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>
