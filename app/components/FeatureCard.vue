<script setup lang="ts">
    defineProps<{ title: string, href: string }>()
</script>
<template>
    <OurLink :href class="manual group p-4 border control-border-control active:control-border-control-pressed bg-card rounded-2">
        <div class="grid featurecard flex-col gap-3 h-full">
            <h3 class="text-card-title">{{ title }}</h3>
            <p class="card-text min-h-20">
                <slot></slot>
            </p>
            <div class="flex" aria-hidden>
                <Control aria-hidden varient="none"
                    class="p-button rounded-control bg-control-primary group-hover:bg-control-secondary group-active:bg-control-tertiary control-border-accent group-active:control-border-accent-pressed">
                    <div>Go!</div>
                </Control>
            </div>
        </div>
    </OurLink>
</template>
<style lang="css" scoped>
    .featurecard {
        grid-template-rows: auto minmax(0, 1fr) auto;
    }
</style>