<script setup lang="ts">
import { Categories } from '~/utils/pages/info';
const curPage = useCurrentPage()
import ChevronUp from '@fluentui/svg-icons/icons/chevron_up_16_regular.svg?raw'
</script>
<template>
    <nav class="fixed h-[calc(100vh-max(30px,_var(--app-titlebar-height,_0px)))] w-80 pr-2">
        <ul>
            <template v-for="category in Categories" :key="category.name">
                <template v-if="!category.shortName">
                    <!-- <li class="list-none w-full h-10 mx-0 flex">
                        <Control variant="ghost" class="w-full text-left grow" :class="curPage?.path === page.path && curPage.parent === category ? 'bg-control-secondary hover:bg-control-tertiary' : ''">
                            <OurLink :to="`${category.path}/${page.path}`" class="manual border-transparent! pl-3 py-0 flex items-center">{{ page.title }}</OurLink>
                        </Control>
                    </li> -->
                    <GlobalNavigationLeafItem v-for="page in category.pages" :key="page.path" :cur-page="curPage"
                        :page="page" />
                </template>
            </template>
            <template v-for="category in Categories" :key="category.name">
                <li v-if="category.shortName" class="list-none w-full mx-0 flex flex-col">
                    <details class="no-marker group">
                        <summary>
                            <Control variant="ghost"
                                class="h-10 w-full text-left grow border-transparent! items-center flex">
                                <div class="pl-3 w-full">
                                    {{ category.shortName }}
                                    <Grow />
                                    <div class="group-open:-rotate-180 transition-transform duration-300">
                                        <Icon :icon="ChevronUp" alt="" />
                                    </div>
                                </div>
                            </Control>
                        </summary>
                        <ul>
                            <GlobalNavigationLeafItem v-for="page in category.pages" :key="page.path"
                                :cur-page="curPage" :page="page" inner-class="pl-8" />
                        </ul>
                    </details>
                </li>
            </template>
        </ul>
    </nav>
</template>
<style lang="css">
details.no-marker>summary {
    list-style: none;
}

details.no-marker>summary::-webkit-details-marker {
    display: none;
}
</style>