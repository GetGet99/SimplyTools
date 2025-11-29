<template>
    <feature class="flex flex-col gap-2 items-center justify-center" details-visible="hidden">
        <LayerBase>
            <Flex column class="gap-2 max-h-40 overflow-y-auto">
                <div v-for="item in list" class="h-16 p-control min-w-40 flex items-center justify-center select-text">
                    {{ item }}</div>
            </Flex>
        </LayerBase>
        Select the tools you would like to use.
        <Flex class="gap-2">
            <LinkButton icon="left" :href="`/random/list/${id}/spinner`">
                <RandomSpinnerIcon />
                Spinner
            </LinkButton>
            <LinkButton icon="left" :href="`/random/list/${id}/wheel`">
                <RandomWheelIcon />
                Wheel
            </LinkButton>
            <LinkButton icon="left" :href="`/random/list/${id}/card`">
                <RandomCardIcon />
                Card
            </LinkButton>
        </Flex>
    </feature>
</template>
<script setup lang="ts">
import { getListAsync, useRandomListItemPageAsync } from "~/utils/random/listManager";
const id = await useRandomListItemPageAsync('viewer')
const list = await getListAsync(id)
</script>
