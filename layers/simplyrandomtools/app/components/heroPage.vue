<script setup lang="ts">
import { useRandomNewListPage, createNewListAsync, type RandomListTools } from '~/utils/random/listManager';
const props = defineProps<{ toolname: RandomListTools }>()
const toolname: RandomListTools = props.toolname
useRandomNewListPage(toolname)
const defaultDescription = `# Add your list items here, separate them by new lines.\n# "#" at the beginning of the line means skip this line`
const defaultList = ['Sunny Meadow', 'Maple Grove', 'Blueberry Hill', 'Crimson Oak', 'Silver Lake', 'Golden Harbor', 'Whispering Pines', 'Starlit Cove', 'Sunnybrook', 'Cedar Ridge']
const newListText = ref(`${defaultDescription}\n${defaultList.join('\n')}`)
</script>
<template>
    <Feature class="flex flex-col gap-2 items-center">
        <slot :list="defaultList" />
        <div class="text-center">Randomly choosing your items with {{ toolname }} machine!</div>
        <CodeEditor lang="plaintext" v-model="newListText" class="h-100 w-full max-w-200 mx-2" />
        <Button @click="async () => {
            const newList = await createNewListAsync(undefined, newListText, `New Items for ${toolname}`)
            navigateTo(`/random/list/${newList}/${toolname}`)
        }">
            Go!
        </Button>
    </Feature>
</template>