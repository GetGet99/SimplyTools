<template>
    <DialogPortal>
        <DialogOverlay class="ContentDialogOverlay">
            <div class="child"></div>
        </DialogOverlay>
        <DialogContent class="ContentDialogContent flex flex-col gap-2" :class>
            <DialogTitle class="flex gap-1 items-center">
                <slot name="title">
                    {{ title }}
                </slot>
                <Grow />

                <Control class="p-button-icon">
                    <DialogClose as-child>
                        <IconClose alt="Close" />
                    </DialogClose>
                </Control>
            </DialogTitle>
            <div class="grow">
                <slot></slot>
            </div>
            <Flex v-if="slots.footer" class="justify-end">
                <slot name="footer"></slot>
            </Flex>
        </DialogContent>
    </DialogPortal>
</template>
<script setup lang="ts">
defineProps<{ class?: string, title?: string, closeButton?: boolean }>()
const slots = useSlots()
</script>
<style>
@reference '~~/layers/simplytools-ui/app/app.css';

@layer components {
    .ContentDialogOverlay {
        @apply z-100 data-[state=open]:bg-smoke fixed inset-0;
    }

    .ContentDialogContent {
        @apply z-100 fixed top-1/2 left-1/2 -translate-1/2 min-w-80 min-h-46 max-w-137 max-h-189;
        @apply bg-solid-primary border border-surface rounded-2;
        @apply p-5 flex flex-col;
    }
}
</style>