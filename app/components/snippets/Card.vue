<script setup lang="ts">
import { getMetadata, getSnippet } from '~/utils/snippets/manager';
    const props = defineProps<{ snippetKey: string }>()
    const meta = await getMetadata(props.snippetKey)
</script>
<template>
    <OurLink :href='`/snippets?view=${snippetKey}`' class="manual group p-4 border control-border-control active:control-border-control-pressed bg-card rounded-2">
        <div class="grid featurecard flex-col gap-3 h-full">
            <h3 class="text-card-title">{{ meta?.name }} {{ meta?.lang ? `(${meta?.lang})` : '' }}</h3>
            <p class="card-text min-h-20">
                {{ meta?.description }}
            </p>
            <div class="flex" aria-hidden>
                <Control aria-hidden varient="none"
                    class="p-button rounded-control bg-control-primary group-hover:bg-control-secondary group-active:bg-control-tertiary control-border-control group-active:control-border-control-pressed">
                    <div>Use</div>
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