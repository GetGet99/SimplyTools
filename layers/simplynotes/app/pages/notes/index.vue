<script setup lang="ts">
import { createNewNoteAsync, getNotesAsync, getNoteTitleAsync } from '../../lib/manager';
import { Apps } from '~/utils/pages/app';
usePageInfo(Apps.pages.find(x => x.path === 'notes'))

const keys = await getNotesAsync()
const notes = await Promise.all(
    keys.map(async (k) => ({ key: k, title: await getNoteTitleAsync(k) }))
)
</script>
<template>
    <Feature category="snippets" tool="Quick Templates" kind="app" app="do-not-center"
        class="md:mx-12 my-12 flex flex-col shrink-0 gap-4">
        <AppSaveWarning />
        Recent Notes
        <OurLink v-for="{ title, key } in notes" :key :href="`/notes/${key}`" class="manual">
            <Control>
                <div class="text-card-title">{{ title }}</div>
            </Control>
        </OurLink>
        <Button @click="async () => {
            let note = await createNewNoteAsync()
            navigateTo(`/notes/${note}`)
        }">
            <div class="text-card-title"> + New</div>
        </Button>
        <div class="hidden app:block grow"></div>
    </Feature>
</template>