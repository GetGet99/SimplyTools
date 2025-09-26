<template>
    <NotesEditor v-model="note" class="grow h-full" />
</template>
<script setup lang="ts">
import { useNote, useNoteTitle, type NoteFileName } from '~/utils/notes/manager';
import type { PageInfo } from '~/utils/pages/_helper';
import { Apps } from '~/utils/pages/app';
const route = useRoute()
const page = Apps.pages.find(x => x.path === 'notes')!
const note = useNote(route.params.fileName as NoteFileName)
const title = useNoteTitle(route.params.fileName as NoteFileName)
usePageInfo({
    ...page, title: title, breadcrumb: [
        {
            type: 'textbox',
            text: title
        }
    ]
} satisfies PageInfo)
</script>