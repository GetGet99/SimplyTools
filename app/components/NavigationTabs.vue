<script setup lang="ts" generic="T extends ((AcceptableValue | AcceptableValue[]) & {})">
import type { AcceptableValue } from 'reka-ui';

const props = defineProps<{
    options: readonly T[]
    label?: string
    placeholder?: string
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
}>()
const selected = defineModel<T>({ required: true })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <ToggleGroupRoot class="flex data-[orientation='vertical']:flex-col" :data-orientation="orientation" :model-value="selected" @update:model-value="(val) => {
      if (val) selected = val as T
    }">
        <ToggleGroupItem v-for="option in options" :value="option" :key="option"
            class="border-0 pb-2 bg-transparent rounded-1 flex flex-col-reverse data-[orientation='vertical']:flex-row items-center gap-1 data-[orientation='vertical']:gap-2 group"
            :data-selected='option === selected' :data-orientation="orientation">
            <span
                class="w-5 h-1 group-data-[orientation='vertical']:w-1 group-data-[orientation='vertical']:h-5 rounded-full mr-0 group-data-[selected='true']:bg-accent-primary"></span>
            <slot :option>
                <div class="capitalize">{{ option }}</div>
            </slot>
        </ToggleGroupItem>
    </ToggleGroupRoot>
</template>