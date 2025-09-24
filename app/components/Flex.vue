<script setup lang="ts">
import { Primitive } from 'reka-ui';

defineProps<{ as?: string, column? : boolean, asChild?: boolean }>()
</script>
<template>
    <Primitive :as="as ?? 'div'" :as-child="asChild" class="flex" :class="column ? 'flex-col' : ''">
        <slot />
    </Primitive>
</template>