import type { Directive } from "vue";

const draggables: HTMLElement[] = [];
const passthroughs: HTMLElement[] = [];

// Send the regions to WebView2
function updateDragRegions() {
    const dragregion: number[][] = draggables.map(el => {
        const rect = el.getBoundingClientRect();
        return [Math.floor(rect.left), Math.floor(rect.top), Math.floor(rect.width), Math.floor(rect.height)];
    });

    const passthrough: number[][] = passthroughs.map(el => {
        const rect = el.getBoundingClientRect();
        return [Math.floor(rect.left), Math.floor(rect.top), Math.floor(rect.width), Math.floor(rect.height)];
    });

    // Send message to C# WebView2 host
    //@ts-ignore
    if (window.chrome?.webview?.postMessage) {
        //@ts-ignore
        window.chrome.webview.postMessage({
            $api: "titlebar.setDragRegion",
            dragregion,
            passthrough
        });
    }
}

if (import.meta.client) {
    // Recalculate regions on window resize
    window.addEventListener('resize', updateDragRegions);
}

const vTitleBarDraggable: Directive<HTMLElement, string> = {
    mounted(el) {
        draggables.push(el);
        updateDragRegions();
    },
    unmounted(el) {
        const index = draggables.indexOf(el);
        if (index !== -1) draggables.splice(index, 1);
        updateDragRegions();
    }
};

const vTitleBarPassthrough: Directive<HTMLElement, string> = {
    mounted(el) {
        passthroughs.push(el);
        updateDragRegions();
    },
    unmounted(el) {
        const index = passthroughs.indexOf(el);
        if (index !== -1) passthroughs.splice(index, 1);
        updateDragRegions();
    }
};

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive('titlebar-draggable', vTitleBarDraggable)
    nuxtApp.vueApp.directive('titlebar-passthrough', vTitleBarPassthrough)
});