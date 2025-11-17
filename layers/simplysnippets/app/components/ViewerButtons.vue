<template>
    <DialogTrigger as-child>
        <Button class="flex gap-1 pr-2" :class>
            Template Source
            <Icon alt="" :icon=OpenPopup class="-scale-x-100 scale-y-100" />
        </Button>
    </DialogTrigger>
    <Control :class>
        <OurLink class="manual flex gap-1 pl-2" :href="`/snippets/new?remix=${encodeURIComponent(snippetKey)}`">
            <Icon alt="" :icon=Remix />
            Remix
        </OurLink>
    </Control>
    <Control v-if="snippetKey.startsWith('local.')" :class>
        <OurLink class="manual flex gap-1 pl-2" :href="`/snippets/${snippetKey}/edit`">
            <Icon alt="" :icon=Edit />
            Edit
        </OurLink>
    </Control>
</template>
<script setup lang="ts">
import OpenPopup from '@fluentui/svg-icons/icons/open_folder_24_regular.svg?raw'
import Edit from '@fluentui/svg-icons/icons/edit_24_regular.svg?raw'
import Remix from '@fluentui/svg-icons/icons/save_copy_24_regular.svg?raw'
defineProps<{ snippetKey: string, snippetCode: string, class?: string }>()
</script>