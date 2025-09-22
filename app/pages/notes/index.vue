<script setup lang="ts">
import { createNewNote, getNotes, getNoteTitle } from '~/utils/notes/manager';
import { Apps } from '~/utils/pages/app';
import { getLocalSnippets } from '~/utils/snippets/manager';
usePageInfo(Apps.pages.find(x => x.path === 'notes'))
</script>
<template>
    <Feature category="snippets" tool="Quick Templates" kind="app" app="do-not-center" class="md:mx-12 my-12 flex flex-col shrink-0 gap-4">
        Recent Notes
        <OurLink v-for="key in getNotes()" :key :href="`notes/${key}`" class="manual">
            <Control>
                <div class="text-card-title">{{ getNoteTitle(key) }}</div>
            </Control>
        </OurLink>
        <Button @click="async () => {
            let note = await createNewNote()
            navigateTo(`notes/${note}`)
        }">
            <div class="text-card-title"> + New</div>
        </Button>
        <div class="hidden app:block grow"></div>
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
}
</style>