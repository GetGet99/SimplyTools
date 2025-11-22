<script setup lang="ts">
const slotMachine = useTemplateRef('slotMachine')
const selectedIndex = ref<number | undefined>(undefined)
</script>
<template>
    <RandomPage tool="spinner" random-text="Roll" v-slot="{ list }" @random="slotMachine?.rollForItem()" v-model="selectedIndex">
        <RandomSpinner ref="slotMachine" :list @select="i => { selectedIndex = i }" />
    </RandomPage>
</template>