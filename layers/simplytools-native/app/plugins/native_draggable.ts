import type { Directive } from "vue";

const draggables: HTMLElement[] = [];
const passthroughs: HTMLElement[] = [];

// Send the regions to WebView2
function updateDragRegions() {
    const dragregion: [number, number, number, number][] = draggables.map(el => {
        const rect = el.getBoundingClientRect();
        return [Math.floor(rect.left), Math.floor(rect.top), Math.floor(rect.width), Math.floor(rect.height)];
    });

    const passthrough: [number, number, number, number][] = passthroughs.map(el => {
        const rect = el.getBoundingClientRect();
        return [Math.floor(rect.left), Math.floor(rect.top), Math.floor(rect.width), Math.floor(rect.height)];
    });

    Native.TitleBar.setDragRegion(dragregion, passthrough)
}

if (import.meta.client) {
    if (Native.isAvaliable)
        // Recalculate regions on window resize
        window.addEventListener('resize', updateDragRegions);
}

const vTitleBarDraggable: Directive<HTMLElement, string> = {
    mounted(el) {
        if (Native.isAvaliable) {
            draggables.push(el);
            updateDragRegions();
        }
    },
    unmounted(el) {
        if (Native.isAvaliable) {
            const index = draggables.indexOf(el);
            if (index !== -1) draggables.splice(index, 1);
            updateDragRegions();
        }
    }
};

const vTitleBarPassthrough: Directive<HTMLElement, string> = {
    mounted(el) {
        if (Native.isAvaliable) {
            passthroughs.push(el);
            updateDragRegions();
        }
    },
    unmounted(el) {
        if (Native.isAvaliable) {
            const index = passthroughs.indexOf(el);
            if (index !== -1) passthroughs.splice(index, 1);
            updateDragRegions();
        }
    }
};

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive('titlebar-draggable', vTitleBarDraggable)
    nuxtApp.vueApp.directive('titlebar-passthrough', vTitleBarPassthrough)
});