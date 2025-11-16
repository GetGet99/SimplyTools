<template>
    <DialogRoot>
        <slot name="trigger">

        </slot>
        <ContentDialogPortal>
            <template v-if="slots.title" #title>
                <slot name="title"></slot>
            </template>
            <template v-if="slots.default" #default>
                <slot></slot>
            </template>
            <template v-if="slots.footer" #footer>
                <slot name="footer"></slot>
            </template>
        </ContentDialogPortal>
    </DialogRoot>
</template>
<script setup lang="ts">
    // import type { ContentDialogPortal as CDP } from '#components'
    // import type { ComponentProps } from 'vue-component-type-helpers';
    // defineProps<ComponentProps<typeof CDP>>()
    const slots = useSlots()
</script>
<style>
    @reference '~~/layers/simplytools-ui/app/app.css';

    @layer components {
        .ContentDialogPortal {
            /* @apply flex w-screen h-screen justify-center items-center; */
        }

        .ContentDialogOverlay {
            @apply data-[state=open]:bg-smoke fixed top-0 bottom-0 left-0 right-0;
        }

        .ContentDialogContent {
            @apply fixed top-1/2 left-1/2 -translate-1/2 min-w-80 min-h-46 max-w-137 max-h-189;
            @apply bg-solid-primary border border-surface rounded-2;
            @apply p-5 flex flex-col;
        }
    }
</style>