<script setup lang="ts">
import { DevB64Page } from '#components';
import { DevCategory } from '~/utils/pages/dev';

usePageInfo(DevCategory.pages.find(x => x.path === `b64/${useRoute().params.mode ?? 'encoder'}`))
if (!useRoute().params.mode) {
    await navigateTo('/dev/b64/encoder', { replace: true })
}
const w = window
let mode = ref<'atob' | 'btoa'>(useRoute().params.mode === 'encoder' ? 'btoa' : 'atob')
watch(() => useRoute().params.mode, (newMode) => {
    console.log('Route mode changed:', newMode)
})
// export {
//     key: ''
// }
</script>
<template>
    <DevB64Page :mode="$route.params.mode === 'encoder' ? 'btoa' : 'atob'" @update:mode="newMode => {
        if (w) {
            // debugger
            // $route.params.mode = newMode === 'btoa' ? 'encoder' : 'decoder'
            $router.push({ params: {
                mode: newMode === 'btoa' ? 'encoder' : 'decoder'
            }})
            // mode = newMode!
            // w.history.pushState(null, '', w.location.href.replace(/(encoder|decoder)/, newMode === 'btoa' ? 'encoder' : 'decoder'))
        }
    }" />
</template>