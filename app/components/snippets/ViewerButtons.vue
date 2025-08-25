<template>
    <DialogTrigger as-child>
        <Button class="flex gap-1" :class>
            Template Source
            <Icon alt="" :icon=OpenPopup />
        </Button>
    </DialogTrigger>
    <Control varient="accent" class="hidden" :class>
        <OurLink class="manual" :href="`/snippets/edit?remix=${encodeURIComponent(snippetKey)}`">
            Remix
        </OurLink>
    </Control>
</template>
<script setup lang="ts">
    import OpenPopup from '@fluentui/svg-icons/icons/open_24_regular.svg?raw'
    defineProps<{ snippetKey: string, snippetCode: string, class?: string }>()

</script>