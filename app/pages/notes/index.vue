<script setup lang="ts">
import { createNewNote, getNotes, getNoteTitle } from '~/utils/notes/manager';
import { Apps } from '~/utils/pages/app';
usePageInfo(Apps.pages.find(x => x.path === 'notes'))
</script>
<template>
    <Feature category="snippets" tool="Quick Templates" kind="app" app="do-not-center"
        class="md:mx-12 my-12 flex flex-col shrink-0 gap-4">
        <AppSaveWarning />
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