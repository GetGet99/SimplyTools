<script setup lang="ts">
import { getListAsync, useRandomListItemPageAsync, createNewListAsync, getListNameAsync } from '~/utils/random/listManager'
import ArrowSync from '@fluentui/svg-icons/icons/arrow_sync_24_regular.svg?raw'
import Save from '@fluentui/svg-icons/icons/save_24_regular.svg?raw'
const id = await useRandomListItemPageAsync('spinner')
const list = ref(await getListAsync(id))
const orignalLen = list.value.length
const slotMachine = useTemplateRef('slotMachine')
const history = ref("")
const selectedIndex = ref<number | undefined>(undefined)
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
            <Button v-if="list.length > 0"
                @click="selectedIndex = undefined; slotMachine?.rollForItem() ?? 0">Roll</Button>
            <Button v-if="selectedIndex !== undefined"
                @click="list.splice(selectedIndex, 1); selectedIndex = undefined">Remove from list</Button>
        </Flex>
        <RandomHistory v-model="history" class="md:max-w-150 not-md:mx-4" />
        <template #summary>
            Generate random integers or real numbers within a custom range.
        </template>

        <template #details>
            <p>
                This random number generator lets you quickly produce random values for any purpose. Choose whether you
                need whole numbers (integers) or decimal values (real numbers), then set your desired range.
            </p>
            <ul>
                <li>Specify the minimum and maximum values to control the output range.</li>
                <li>Generate multiple numbers at once by entering how many results you need.</li>
                <li>Decide whether results replace the output (auto-clear) or get appended as a growing list.</li>
                <li>Easily copy the results or clear them with a single click.</li>
            </ul>
        </template>
    </Feature>
</template>