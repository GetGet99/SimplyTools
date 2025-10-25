<script setup lang="ts">
const isOffline = ref(false)
const url = ref('')
onMounted(() => {
    isOffline.value = window.location.hostname === 'simplytools.local'
    const pathname = window.location.pathname || ''
    let trimmed = pathname.replace(/^\/+/, '')

    // Remove GitHub Pages repo base if present
    const ghBase = 'SimplyTools'
    if (window.location.hostname === 'getget99.github.io' && (trimmed === ghBase || trimmed.startsWith(ghBase + '/'))) {
        trimmed = trimmed === ghBase ? '' : trimmed.slice(ghBase.length + 1)
    }
    if (trimmed.endsWith('/')) {
        trimmed = trimmed.slice(0, -1)
    }

    url.value = trimmed + window.location.search + window.location.hash
})
const current = computed(() => {
    return isOffline.value ? 'offline' : 'online'
})
const opposite = computed(() => {
    return isOffline.value ? 'online' : 'offline'
})
</script>
<template>
    <Flex column class="items-start bg-critical p-4 gap-1 rounded-2 not-app:hidden">
        <span class="text-h2 font-bold text-danger">Warning</span>
        <span>
            Changes you make here (the {{ current }} copy) are stored separately from the {{ opposite }} copy — the app
            currently keeps each site's data isolated (this is how <code>localStorage</code> works), so edits made on the {{ current
            }} copy won't automatically appear on the {{ opposite }} copy (and vice versa). We plan to add
            data-sharing/sync support later. To open and continue with your {{ opposite }} copy, click "Visit <span
                class="capitalize">{{ opposite }}</span> Site".
        </span>
        <Control>
            <!-- we don't support navigation for now -->
            <OurLink :href="`https://simplytools.local/`" v-if="!isOffline" class="manual my-auto row-span-2">Visit
                Offline Site</OurLink>
            <OurLink :href="`https://getget99.github.io/SimplyTools/${url}`" v-else class="manual my-auto row-span-2">
                Visit Online Site</OurLink>
        </Control>
    </Flex>
</template>