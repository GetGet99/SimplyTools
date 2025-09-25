<script setup lang="ts">
import type { Page, PageInfo } from '~/utils/pages/_helper';
import { Apps, type AppPage } from '~/utils/pages/app';

const props = defineProps<{ curPage: PageInfo | undefined, page: Page, innerClass?: string }>()
const category = computed(() => props.page.parent)
const route = useRoute()
// const isSelected = computed(() => props.curPage?.path === props.page.path && props.curPage.parent === category.value)

const isSelected = computed(() => route.path.startsWith(`${category.value.path}/${props.page.path}`))
</script>
<template>
    <li class="list-none w-full h-10 mx-0 flex">
        <Control variant="ghost" class="w-full text-left grow"
            :class="isSelected ? 'bg-control-secondary hover:bg-control-tertiary' : ''">
            <OurLink :to="`${category.path}/${page.path}`"
                class="manual border-transparent! pl-1 py-0 flex gap-2 items-center group" :class="innerClass" :aria-current="isSelected ? 'page' : undefined">
                <span class="w-1 h-5 rounded-full mr-0 group-aria-[current=page]:bg-accent-primary"></span>
                {{ page.parent === Apps ? (page as AppPage).appName : page.title }}
            </OurLink>
        </Control>
    </li>
</template>