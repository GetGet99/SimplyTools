<script setup lang="ts">
import { getListAsync, useRandomListItemPageAsync, createNewListAsync, getListNameAsync, type RandomListTools } from '~/utils/random/listManager'
import ArrowSync from '@fluentui/svg-icons/icons/arrow_sync_24_regular.svg?raw'
import Save from '@fluentui/svg-icons/icons/save_24_regular.svg?raw'

const props = defineProps<{ tool: RandomListTools, randomText?: string }>()

const id = await useRandomListItemPageAsync(props.tool)
const list = ref(await getListAsync(id))
const orignalLen = list.value.length
const history = ref("")
const selectedIndex = ref<number | undefined>(undefined)
defineEmits<{
    random: []
}>()
</script>
<template>
    <Feature class="flex flex-col gap-4 justify-center items-center">
        <Flex v-if="list.length !== orignalLen" class="gap-2">
            <Button icon="left" @click="async () => list = await getListAsync(id)">
                <Icon :icon="ArrowSync" alt="" />
                Reset List
            </Button>
            <Button icon="left" @click='async () => {
                const name = await getListNameAsync(id)
                const newId = await createNewListAsync(undefined, `# Remaining items from list "${name}"\n${list.join("\n")}`, `Remaining items from ${name}`)
                await navigateTo(`/random/list/${encodeURIComponent(newId)}/edit`)
            }'>
                <Icon :icon="Save" alt="" />
                Save remaining list
            </Button>
        </Flex>
        <ClientOnly>
            <RandomSlotMachineList v-if="list.length > 0" ref="slotMachine" :list @select="i => {
                selectedIndex = i
                const item = list[i]!
                history = history ? `${item}\n${history}` : item
            }" />
        </ClientOnly>
        <Flex class="gap-2">
            <Button @click="selectedIndex = undefined; $emit('random')">
                <slot v-if="list.length > 0" name="randomButtonChildren">
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