<script setup lang="ts">
    defineProps<{ title: string, href: string }>()
</script>
<template>
    <OurLink :href class="manual group p-4 border control-border-control active:control-border-control-pressed bg-card rounded-2">
        <Grid rows="auto grow auto" class="gap-3 h-full">
            <h3 class="text-card-title">{{ title }}</h3>
            <p class="card-text min-h-20">
                <slot></slot>
            </p>
            <Flex aria-hidden>
                <Control aria-hidden variant="none"
                    class="bg-control-primary group-hover:bg-control-secondary group-active:bg-control-tertiary control-border-control group-active:control-border-control-pressed">
                    <div>Go!</div>
                </Control>
            </Flex>
        </Grid>
    </OurLink>
</template>