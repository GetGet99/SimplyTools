import type { ToastErrorsExports } from "../components/Generator.vue";

export function useToasts() {
    return inject<ToastErrorsExports>('toasts.generator')!
}