<script setup lang="ts">
const wheel = useTemplateRef('wheel')
const selectedIndex = ref<number | undefined>(undefined)
</script>
<template>
    <RandomPage tool="wheel" random-text="Roll" v-slot="{ list }" @random="wheel?.rollForItem()" v-model="selectedIndex">
        <RandomWheel ref="wheel" :list @select="i => { selectedIndex = i }" />
    </RandomPage>
</template>