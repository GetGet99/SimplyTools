import type { ToastErrorsExports } from "~/components/toasts/Generator.vue";

export function useToasts() {
    return inject<ToastErrorsExports>('toasts.generator')!
}