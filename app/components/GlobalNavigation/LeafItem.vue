<script setup lang="ts">
import type { Page, PageInfo } from '~/utils/pages/_helper';

const props = defineProps<{ curPage: PageInfo | undefined, page: Page, innerClass?: string }>()
const category = computed(() => props.page.parent)
</script>
<template>
    <li class="list-none w-full h-10 mx-0 flex">
        <Control variant="ghost" class="w-full text-left grow"
            :class="curPage?.path === page.path && curPage.parent === category ? 'bg-control-secondary hover:bg-control-tertiary' : ''">
            <OurLink :to="`${category.path}/${page.path}`"
                class="manual border-transparent! pl-3 py-0 flex items-center" :class="innerClass">{{ page.title }}</OurLink>
        </Control>
    </li>
</template>