<script setup lang="ts">
const curPage = useCurrentPage()
import ChevronUp16 from '@fluentui/svg-icons/icons/chevron_up_16_regular.svg?raw'
import { isMobileNavVisible } from '../../utils/navigation/mobile';
</script>
<template>
    <nav class="global-nav-view fixed max-h-mainarea-height h-mainarea-height w-80 pr-2" :data-mobile-nav-visible="isMobileNavVisible">
        <ul>
            <template v-for="category in Categories" :key="category?.name">
                <template v-if="category && !category.shortName && category !== Apps">
                    <GlobalNavigationLeafItem v-for="page in category.pages" :key="page.path" :cur-page="curPage"
                        :page="page" />
                </template>
            </template>
            <template v-for="category in Categories" :key="category?.name">
                <li v-if="category && category.shortName && category !== Apps" class="list-none w-full mx-0 flex flex-col">
                    <GlobalNavigationDetails class="no-marker group" :default-open="curPage && category.pages.some(page => page === curPage)">
                        <summary>
                            <Control variant="ghost"
                                class="h-10 w-full text-left grow border-transparent! items-center flex">
                                <div class="pl-4 w-full">
                                    {{ category.shortName }}
                                    <Grow />
                                    <div class="group-open:-rotate-180 transition-transform duration-300">
                                        <Icon :icon="ChevronUp16" alt="" />
                                    </div>
                                </div>
                            </Control>
                        </summary>
                        <ul>
                            <GlobalNavigationLeafItem v-for="page in category.pages" :key="page.path"
                                :cur-page="curPage" :page="page" inner-class="pl-6" />
                        </ul>
                    </GlobalNavigationDetails>
                </li>
            </template>
            <GlobalNavigationLeafItem v-for="page in Apps.pages" :key="page.path" :cur-page="curPage"
                :page="page" />
        </ul>
    </nav>
</template>
<style lang="css">
@reference "~~/layers/simplytools-ui/app/app.css";
details.no-marker>summary {
    list-style: none;
}

details.no-marker>summary::-webkit-details-marker {
    display: none;
}
.global-nav-view {
    @apply transition-transform duration-500 overflow-y-auto ease-theme mt-titlebar-height top-0 bottom-0 z-100;
    @variant not-lg {
        @apply bg-solid-primary -translate-x-full;
        @variant data-[mobile-nav-visible=true] {
            @apply translate-x-0;
        }
        @variant not-data-[mobile-nav-visible=true] {
            @apply pointer-events-none;
        }
    }
}
</style>