const colorScheme = ref<'light' | 'dark'>('dark')
if (window?.matchMedia) {
    // Detect the initial color scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    colorScheme.value = prefersDarkScheme.matches ? 'dark' : 'light';

    function changeHandler(event: MediaQueryListEvent) {
        colorScheme.value = event.matches ? 'dark' : 'light';
    }
    // Listen for changes in the color scheme
    prefersDarkScheme.addEventListener('change', changeHandler);
}
export function useColorScheme() {
    return colorScheme
}