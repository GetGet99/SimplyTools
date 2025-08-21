<script setup lang="ts">
    const props = defineProps<{ name: string, processor: (color: Color) => Color }>()
    const color = defineModel<Color>()
    const newColor = computed(() => props.processor(color.value ?? RGB.Empty()))
</script>
<template>
    <div class="flex flex-col gap-6 shrink-0">
        <div class="text-center">{{ name }}</div>
        <div class="flex justify-center">
            <div class="w-20 h-20 rounded-full border border-control-strong" :style="{
                backgroundColor: newColor.CSS
            }"></div>
        </div>
        <div class="flex justify-center">
            {{ newColor.HEX.HexCodeWithHash }}
        </div>
    </div>
</template>