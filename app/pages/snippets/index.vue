<script setup lang="ts">
    const url = useRoute()
    const view = computed(() => url.query.view)
</script>
<template>
    <Feature category="snippets" tool="Quick Templates" class="flex flex-col gap-4" :limit-screen=!!view>
        <p class="text-center">Find templates you wish to use, or
            <OurLink href="/snippets/editor">Create your own!</OurLink>
        </p>
        <div class="mx-30 grow grid gap-4"
            :style="view ? { gridTemplateColumns: 'calc(var(--spacing) * 80) minmax(0, 1fr)' } : {}">
            <div class="sm:mx2 my-2 grid data-view:flex flex-col gap-4 not-data-view:lg:grid-cols-3 not-data-view:md:grid-cols-2 not-data-view:sm:grid-cols-1 data-view:overflow-y-auto"
                :data-view="!!view">
                <SnippetsCard snippet-key="builtin.examples.item" />
                <SnippetsCard snippet-key="builtin.csharp.properties" />
            </div>
            <div v-if="view">
                <SnippetsViewer class="h-full" v-if="typeof view === 'string'" :snippetKey=view />
            </div>
        </div>
    </Feature>
</template>