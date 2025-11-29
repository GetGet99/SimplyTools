<template>
    <Layer v-if="error" class="p-2">
        <template v-if="error === 'Error: No input text'">Please type text and the QR Code will show up here</template>
        <template v-else>{{ error }}</template>
    </Layer>
    <img v-else-if="mode === 'img'" :alt="`QR Code for ${props.value}`" :src :class />
    <img v-else-if="mode === 'svg'" :alt="`QR Code for ${props.value}`" :src="`data:image/svg+xml,${encodeURIComponent(svg)}`" :class />
    <!-- <div v-else v-html="svg" :class></div> -->
</template>
<script setup lang="ts">
import QRCode from 'qrcode'

const error = ref('')
const src = ref('')
const svg = ref('')
const props = defineProps<{
    class?: string
    value: string,
    mode: 'img' | 'svg',
    foreground: string,
    background: string,
    size: number,
    padding: number
}>()
defineExpose({ 
    pngData: src,
    svg: svg
})
watch(props, async () => {
    const options = {
        color: {
            dark: props.foreground,
            light: props.background
        },
        scale: props.size,
        margin: props.padding
    }
    if (props.mode === 'img') {
        try {
            src.value = await QRCode.toDataURL(props.value, options)
            error.value = ''
        } catch (err) {
            error.value = err?.toString() ?? ''
        }
    } else {
        try {
            svg.value = await QRCode.toString(props.value, { type: 'svg', ...options })
            error.value = ''
        } catch (err) {
            error.value = err?.toString() ?? ''
        }
    }
}, { immediate: true })
</script>