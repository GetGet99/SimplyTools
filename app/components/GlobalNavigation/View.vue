<script setup lang="ts">
import { Categories } from '~/utils/pages/info';
const curPage = useCurrentPage()
import ChevronUp from '@fluentui/svg-icons/icons/chevron_up_16_regular.svg?raw'
import { Apps } from '~/utils/pages/app';
import { isMobileNavVisible } from '~/utils/navigation/mobile';
</script>
<template>
    <nav class="global-nav-view fixed h-mainarea-height w-80 pr-2 min-h-full" :data-mobile-nav-visible="isMobileNavVisible">
        <ul>
            <template v-for="category in Categories" :key="category.name">
                <template v-if="!category.shortName && category !== Apps">
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
                <li v-if="category.shortName && category !== Apps" class="list-none w-full mx-0 flex flex-col">
                    <details class="no-marker group">
                        <summary>
                            <Control variant="ghost"
                                class="h-10 w-full text-left grow border-transparent! items-center flex">
                                <div class="pl-4 w-full">
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
                                :cur-page="curPage" :page="page" inner-class="pl-6" />
                        </ul>
                    </details>
                </li>
            </template>
            <GlobalNavigationLeafItem v-for="page in Apps.pages" :key="page.path" :cur-page="curPage"
                :page="page" />
        </ul>
    </nav>
</template>
<style lang="css">
@reference "~/app.css";
details.no-marker>summary {
    list-style: none;
}

details.no-marker>summary::-webkit-details-marker {
    display: none;
}
.global-nav-view {
    @apply transition-transform duration-500 overflow-y-auto ease-theme;
    @variant not-lg {
        @apply bg-solid-primary -translate-x-full mt-titlebar-height top-0 bottom-0 z-100;
        @variant data-[mobile-nav-visible=true] {
            @apply translate-x-0;
        }
        @variant not-data-[mobile-nav-visible=true] {
            @apply pointer-events-none;
        }
    }
}
</style>