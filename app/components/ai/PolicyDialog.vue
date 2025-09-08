<template>
    <ContentDialog>
        <template #trigger>
            <slot name="trigger"></slot>
        </template>
        <template #title>
            <h3 class="text-lg font-semibold">AI Policy Agreement</h3>
        </template>

        <template #default>
            <p class="my-4">
                By using the AI tools, you agree to comply with our
                <OurLink href="/ai/policy" target="_blank">AI Policy</OurLink>, and
                your browser's provider's' AI usage rules. Do not input harmful,
                illegal, or prohibited content. We are not responsible for your misuse of these tools.
            </p>
        </template>

        <template #footer>
            <div class="flex justify-end gap-2">
                <DialogClose as-child>
                    <Button class="px-4 py-2">Cancel</Button>
                </DialogClose>
                <DialogClose as-child>
                    <Button class="px-4 py-2" variant="accent" @click="accept">I Agree</Button>
                </DialogClose>
            </div>
        </template>
    </ContentDialog>
</template>

<script setup lang="ts">

const { accepted, accept } = useAIPolicyStatus()
</script>
