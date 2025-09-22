<template>
    <Feature class="flex flex-col" app="do-not-center" limit-screen="all">
        <NotesEditor v-model="note" class="grow h-full" />
    </Feature>
</template>
<script setup lang="ts">
import { useNote, useNoteTitle, type NoteFileName } from '~/utils/notes/manager';
import type { PageInfo } from '~/utils/pages/_helper';
import { Apps } from '~/utils/pages/app';
import type { UUID } from '~/utils/types';
const route = useRoute()
const page = Apps.pages.find(x => x.path === 'notes')!
const note = useNote(route.params.fileName as NoteFileName)
const title = useNoteTitle(route.params.fileName as NoteFileName)
usePageInfo({ ...page, title: title } satisfies PageInfo)
</script>