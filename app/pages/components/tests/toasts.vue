<script setup lang="ts">
const toasts = useToasts()
function delay(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
</script>
<template>
    <Flex column class="w-screen h-screen justify-center items-center gap-5">
        <Button @click="toasts.pushError('Example Error')">
            Send Error
        </Button>
        <Button @click="async () => {
            const progress = ref(0)
            toasts.pushProgress('Example Progress', progress)
            while (progress.value <= 1) {
                await delay(1000)
                progress.value += 0.15
            }
        }">
            Send Progress
        </Button>
    </Flex>
</template>