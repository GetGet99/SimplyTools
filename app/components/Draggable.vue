<template>
    <draggable v-model:list="model">
        <template #item="{ element, index }">
            <slot name="item" :element="(element as T)" :index="(index as number)"></slot>
        </template>
    </draggable>
</template>
<script setup lang="ts" generic="T">
import draggable from 'vuedraggable'
const model = defineModel<T[]>()
</script>