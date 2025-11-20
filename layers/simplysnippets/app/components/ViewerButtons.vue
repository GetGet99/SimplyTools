<template>
    <DialogTrigger as-child>
        <Button class="flex gap-1 pr-2" :class>
            Template Source
            <IconOpenFolder alt="" class="-scale-x-100 scale-y-100" />
        </Button>
    </DialogTrigger>
    <Control :class>
        <OurLink class="manual flex gap-1 pl-2" :href="`/snippets/new?remix=${encodeURIComponent(snippetKey)}`">
            <IconSaveCopy alt="" />
            Remix
        </OurLink>
    </Control>
    <Control v-if="snippetKey.startsWith('local.')" :class>
        <OurLink class="manual flex gap-1 pl-2" :href="`/snippets/${snippetKey}/edit`">
            <IconEdit alt="" />
            Edit
        </OurLink>
    </Control>
</template>
<script setup lang="ts">
defineProps<{ snippetKey: string, snippetCode: string, class?: string }>()
</script>