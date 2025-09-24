<script setup lang="ts">
    const props = defineProps<{ name: string, processor: (color: Color) => Color }>()
    const color = defineModel<Color>()
    const newColor = computed(() => props.processor(color.value ?? RGB.Empty()))
</script>
<template>
    <Flex column class="gap-6">
        <div class="text-center">{{ name }}</div>
        <Flex column class="gap-3">
            <Flex class="justify-center">
                <div class="w-20 h-20 rounded-full border border-control-strong" :style="{
                    backgroundColor: newColor.CSS
                }"></div>
            </Flex>
            <Flex class="justify-center">
                {{ newColor.HEX.HexCodeWithHash }}
            </Flex>
            <Button @click="color = newColor">Apply</Button>
        </Flex>
    </Flex>
</template>