<template>
    <DialogPortal class="ContentDialogPortal">
        <DialogOverlay class="ContentDialogOverlay">
            <div class="child"></div>
        </DialogOverlay>
        <DialogContent class="ContentDialogContent" :class>
            <DialogTitle class="flex">
                <slot name="title">
                    {{ title }}
                </slot>
                <div class="grow"></div>

                <Control class="p-button-icon">
                    <DialogClose as-child>
                        <Icon alt="" :icon=CloseIcon />
                    </DialogClose>
                </Control>
            </DialogTitle>
            <slot></slot>
        </DialogContent>
    </DialogPortal>
</template>
<script setup lang="ts">
    import CloseIcon from '@fluentui/svg-icons/icons/dismiss_24_regular.svg?raw'
    defineProps<{ class?: string, title?: string, closeButton?: boolean }>()
</script>
<style>
    @reference '../app.css';

    @layer components {
        .ContentDialogOverlay {
            @apply z-100 data-[state=open]:bg-smoke fixed top-0 bottom-0 left-0 right-0;
        }

        .ContentDialogContent {
            @apply z-100 fixed top-1/2 left-1/2 -translate-1/2 min-w-80 min-h-46 max-w-137 max-h-189;
            @apply bg-solid-primary border border-surface rounded-2;
            @apply p-5 flex flex-col;
        }
    }
</style>