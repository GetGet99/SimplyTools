<template>
    <Grid :columns="1" :rows="1" class="gap-4 h-screen overflow-hidden p-2" details-visible="hidden">
        <!-- Template Editor -->
        <Flex column class="gap-2 row-span-2">
            <Flex class="items-center gap-1">
                <label class="font-bold p-button px-0">List (autosaved)</label>
                <Grow />
                <Control>
                    <OurLink class="manual flex gap-1 pl-2" :href="`/random/list/${id}`">
                        <IconEye alt="" />
                        Continue to main app
                    </OurLink>
                </Control>
            </Flex>
            <CodeEditor lang="plaintext" v-model="listRaw" class="grow" />
        </Flex>
    </Grid>
</template>

<script setup lang="ts">
import type { Uri } from "monaco-editor";
import { useListRawEditableAsync, useRandomListItemPageAsync } from "~/utils/random/listManager";
// --------------------
// Refs
// --------------------
let uri = undefined
if (import.meta.client) {
    uri = 'inmemory://index.liquid' as any as Uri
}
const id = await useRandomListItemPageAsync('editor')
const listRaw = await useListRawEditableAsync(id)

</script>
