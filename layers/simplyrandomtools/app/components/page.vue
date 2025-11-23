<script setup lang="ts">
import { getListAsync, useRandomListItemPageAsync, createNewListAsync, getListNameAsync, type RandomListTools } from '~/utils/random/listManager'

const props = defineProps<{ tool: RandomListTools, randomText?: string }>()
const selectedIndex = defineModel<number | undefined>()

const id = await useRandomListItemPageAsync(props.tool)
const list = ref(await getListAsync(id))
const orignalLen = list.value.length
const history = ref("")
defineEmits<{
    random: []
}>()
watch(selectedIndex, () => {
    if (selectedIndex.value !== undefined) {
        const item = list.value[selectedIndex.value]!
        history.value = history.value ? `${item}\n${history.value}` : item
    }
})
</script>
<template>
    <Feature class="flex flex-col gap-4 justify-center items-center" details-visible="hidden">
        <Flex v-if="list.length !== orignalLen" class="gap-2">
            <Button icon="left" @click="async () => list = await getListAsync(id)">
                <IconArrowSync alt="" />
                Reset List
            </Button>
            <Button icon="left" @click='async () => {
                const name = await getListNameAsync(id)
                const newId = await createNewListAsync(undefined, `# Remaining items from list "${name}"\n${list.join("\n")}`, `Remaining items from ${name}`)
                await navigateTo(`/random/list/${encodeURIComponent(newId)}/edit`)
            }'>
                <IconSave alt="" />
                Save remaining list
            </Button>
        </Flex>
        <ClientOnly v-if="list.length > 0">
            <slot :list />
        </ClientOnly>
        <Flex class="gap-2">
            <Button v-if="list.length > 0" @click="selectedIndex = undefined; $emit('random')">
                <slot name="randomButtonChildren">
                    {{ randomText }}
                </slot>
            </Button>
            <Button v-if="selectedIndex !== undefined"
                @click="list.splice(selectedIndex, 1); selectedIndex = undefined">Remove from list</Button>
        </Flex>
        <RandomHistory v-model="history" class="md:max-w-150 not-md:mx-4" />
        <template #summary v-if="$slots.summary">
            <slot name="summary" />
        </template>

        <template #details v-if="$slots.details">
            <slot name="details" />
        </template>
    </Feature>
</template>