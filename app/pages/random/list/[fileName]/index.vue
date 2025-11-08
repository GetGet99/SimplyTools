<template>
    <feature class="flex flex-col items-center justify-center">
        Select the tools you would like to use.
        <LinkButton :href="`/random/list/${id}/spinner`">
            Spinner
        </LinkButton>
    </feature>
</template>
<script setup lang="ts">
import { useRandomListItemPageAsync } from "~/utils/random/listManager";
const id = await useRandomListItemPageAsync('viewer')
</script>
