<script setup lang="ts">
import { reactive, type Reactive } from 'vue';
import type { ErrorToastPayload } from './Error.vue';
import type { InfoToastPayload } from './Info.vue';
import type { ProgressToastPayload } from './Progress.vue';

const toasts = ref<(Reactive<ErrorToastPayload> | Reactive<InfoToastPayload> | Reactive<ProgressToastPayload>)[]>([])

function pushError(error: string | Ref<string>) {
    toasts.value.push(reactive({ type: 'error', error }) satisfies Reactive<ErrorToastPayload>)
}
function pushInfo(title: string | Ref<string>, desc: string | Ref<string>, dismissable?: boolean | Ref<boolean>, open?: boolean | Ref<boolean>) {
    if (dismissable === undefined) dismissable = true
    if (open === undefined) open = true
    toasts.value.push(reactive({ type: 'info', title, desc, dismissable }) satisfies Reactive<InfoToastPayload>)
}
function pushProgress(title: string | Ref<string>, progress: Ref<number>, duration?: number | Ref<number>) {
    if (duration === undefined) duration = 2000
    toasts.value.push(reactive({ type: 'progress', title, progress, duration }) satisfies Reactive<ProgressToastPayload>)
}
const exports = { pushError, pushProgress }
export type ToastErrorsExports = typeof exports
provide('toasts.generator', exports);
</script>
<template>
    <template v-for="(payload, index) in toasts" :key="index">
        <ToastsError v-if="payload.type === 'error'" v-bind="payload" />
        <ToastsInfo v-if="payload.type === 'info'" v-bind="payload" />
        <ToastsProgress v-if="payload.type === 'progress'" v-bind="payload" />
    </template>
    <slot />
</template>
<style>
@reference '~~/layers/simplytools-theme/app/app.css';

@theme reference {
    --animate-hide: hide 100ms ease-in;
    --animate-slideIn: slideIn 150ms cubic-bezier(0.41, 0.52, 0, 0.94);
    --animate-swipeOut: swipeOut 100ms ease-out;
}

.toast-item {
    @apply translate-x-0;
    @apply data-[state=open]:animate-slideIn data-[state=closed]:animate-hide;
    @apply data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0;
}

.toast-item[data-swipe="cancel"],
.toast-item[data-swipe="end"],
.toast-item[data-state="close"] {
    transition: transform 600ms cubic-bezier(0.41, 0.52, 0, 0.94);
}

.toast-item[data-swipe="end"],
.toast-item[data-state="close"] {
    transform: translateX(calc(100% + --spacing(6)));
}


:root {
    --animate-hide: hide 100ms ease-in;
    --animate-slideIn: slideIn 600ms cubic-bezier(0.41, 0.52, 0, 0.94);
    --animate-swipeOut: swipeOut 600ms ease-out;
}

@keyframes hide {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes slideIn {
    0% {
        transform: translateX(calc(100% + --spacing(6)));
    }

    100% {
        transform: translateX(0);
    }
}
</style>