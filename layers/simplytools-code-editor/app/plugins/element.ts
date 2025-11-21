import type { Directive } from "vue";
import { isRef } from "vue";

export const vGetElement : Directive<HTMLElement> = {
  mounted(el, binding) {
    const target = binding.value;
    if (isRef(target)) {
      target.value = el; // assign raw DOM element
    } else if (typeof target === "function") {
      target(el); // callback usage
    }
  },
  updated(el, binding) {
    const target = binding.value;
    if (isRef(target)) {
      target.value = el;
    } else if (typeof target === "function") {
      target(el);
    }
  },
  unmounted(_, binding) {
    const target = binding.value;
    if (isRef(target)) {
      target.value = null;
    } else if (typeof target === "function") {
      target(null);
    }
  }
};

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive('get-element', vGetElement)
});