<script setup lang="ts">
    import { getBuiltInSnippets, getLocalSnippets } from '~/utils/snippets/manager';

    const url = useRoute()
    const view = computed(() => url.query.view)
</script>
<template>
    <Feature category="snippets" tool="Quick Templates" class="flex flex-col gap-4"
        :limit-screen="view ? 'xl' : undefined">
        <p class="text-center">Find templates you wish to use, or
            <OurLink href="/snippets/new">Create your own!</OurLink>
        </p>
        <div class="snippets-root grow" :data-view="!!view">
            <div class="snippets-list" :data-view="!!view">
                <ClientOnly>
                    <SnippetsCard v-for="key in getLocalSnippets()" :snippet-key="key" />
                </ClientOnly>
                <SnippetsCard v-for="key in getBuiltInSnippets()" :snippet-key="key" />
            </div>
            <SnippetsViewer v-if="view" class="not-xl:-order-1 h-full" :snippetKey='(view as string)' />
        </div>
    </Feature>
</template>
<style scoped>
    @reference '../../app.css';

    .snippets-root {
        @apply mx-10 lg:mx-30 grid gap-4;

        @variant data-view {
            @variant xl {
                @apply overflow-hidden;
                grid-template-columns: calc(var(--spacing) * 80) minmax(0, 1fr);
            }
        }
    }

    .snippets-list {
        @apply sm:mx-1 xl:mx-2 my-2 gap-4;


        @apply grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3;

        @variant data-view {
            @variant xl {
                @apply flex flex-col overflow-y-auto;
            }
        }
    }
</style>