<script setup lang="ts">
import { Apps } from '~/utils/pages/app';
import { getBuiltInSnippets, getLocalSnippets } from '~/utils/snippets/manager';
usePageInfo(Apps.pages.find(x => x.path === 'snippets'))
const url = useRoute()
const view = computed(() => url.query.view)
</script>
<template>
    <Feature category="snippets" tool="Quick Templates" kind="app" class="flex flex-col gap-4"
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
        <template #summary>
            Quickly find and use code templates for your projects, or create your own custom snippets.
        </template>
        <template #details>
            <p>
                The Quick Templates feature lets you browse built-in code snippets or add your own reusable templates.
                Streamline your workflow by copying and customizing snippets for any use case.
                All templates are managed in one place for easy access and editing.
            </p>
            <p>
                Built-in snippets cover common patterns and best practices, while custom snippets allow you to tailor
                solutions to your needs.
                Perfect for developers who want to save time and avoid repetitive coding tasks.
            </p>
        </template>
    </Feature>
</template>
<style scoped>
@reference '../../app.css';

.snippets-root {
    @apply grid mx-10 lg:mx-30 gap-4;

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