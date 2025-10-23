<script setup lang="ts">
import Home from '@fluentui/svg-icons/icons/home_24_regular.svg?raw'
import ChevronRight from '@fluentui/svg-icons/icons/chevron_right_24_regular.svg?raw'
import SettingsIcon from '@fluentui/svg-icons/icons/settings_24_regular.svg?raw'
import NavigationIcon from '@fluentui/svg-icons/icons/navigation_24_regular.svg?raw'
import { isMobileNavVisible } from '~/utils/navigation/mobile'
import simplyToolsIcon from '~/assets/SimplyToolsIcon.png'
const tool = usePageInfo()
</script>
<template>
    <div class="h-titlebar-height"></div>
    <ClientOnly>
        <Flex class="titlebar fixed top-0 left-0 right-0 h-titlebar-height">
            <div style="width: var(--app-titlebar-reserved-area-left, 0px);" v-titlebar-draggable></div>
            <Flex class="gap-1 items-center backdrop-blur-lg rounded-br-md pr-2">
                <div class="not-app:hidden lg:hidden px-1.5 h-full flex items-center" v-titlebar-draggable>
                    <img :src="simplyToolsIcon" alt="" class="w-5.25 h-5.25 not-app:hidden" />
                </div>
                <Button @click="isMobileNavVisible = !isMobileNavVisible" variant="ghost" class="app:-ml-1 px-0 py-0 h-full flex gap-1 items-center rounded-0 border-transparent lg:hidden w-8 justify-center">
                    <Icon :icon=NavigationIcon alt="Toggle navigation sidebar" class="scale-[87.5%]" />
                </Button>
                <Control variant="ghost" class="not-app:-ml-1 app:not-lg:-ml-1 px-2 app:pl-1 py-0 h-full flex gap-1 items-center rounded-0 border-transparent">
                    <OurLink class="manual flex gap-1 not-lg:pl-1" tabindex="0" href="/">
                        <Icon :icon=Home alt="Home" class="scale-[87.5%] not-lg:hidden app:hidden" />
                        <img :src="simplyToolsIcon" alt="" class="w-5.25 h-5.25 not-app:hidden not-lg:hidden" />
                        SimplyTools
                    </OurLink>
                </Control>
                <template v-for="(breadcrumbItem, index) in tool.breadcrumb" :key="index">
                    <Icon :icon=ChevronRight alt="to" v-titlebar-draggable />
                    <Control variant="ghost" v-if="breadcrumbItem.type === 'link'" class="px-2 py-0 h-full flex items-center rounded-0 border-transparent">
                        <OurLink class="manual" :href="breadcrumbItem.href">
                            {{ breadcrumbItem.text }}
                        </OurLink>
                    </Control>
                    <div v-else-if="breadcrumbItem.type === 'text'" class="p-2">
                        {{ breadcrumbItem.text }}
                    </div>
                    <TextBox v-else-if="breadcrumbItem.type === 'textbox'" v-model="breadcrumbItem.text.value"
                        class="mx-1 px-1 py-0 flex items-center" />

                </template>
                <!-- <template v-if="tool.breadcrumb.length >= 2 && tool.toolName">
                    <Icon :icon=ChevronRight alt="to" />
                    <OurLink class="manual p-2" :class="tool.category === Apps ? undefined : 'pointer-events-none'"
                        :href="tool.category === Apps ? `${tool.catPath}/${tool.toolPath}` : `${tool.catPath}`">
                        {{ tool.breadcrumb[0] }}
                    </OurLink>
                </template>
                <template v-if="tool.breadcrumb.length >= 1">
                    <Icon :icon=ChevronRight alt="to" />
                    <OurLink class="manual p-2" :href="`${tool.catPath}/${tool.toolPath}`">
                        {{ tool.breadcrumb[tool.breadcrumb.length - 1]! }}
                    </OurLink>
                </template> -->
            </Flex>
            <div class="grow h-full" v-titlebar-draggable></div>
            <Flex class="backdrop-blur-lg rounded-bl-md"> <!--pl-2-->
                <SettingsDialog>
                    <template #trigger>
                        <DialogTrigger as-child>
                            <Button class="hidden p-[3px] bg-transparent border-transparent" title="Settings">
                                <Icon :icon=SettingsIcon alt="" />
                            </Button>
                        </DialogTrigger>
                    </template>
                </SettingsDialog>
                <div class="app:w-60" style="width: var(--app-titlebar-reserved-area-right, 250px);"
                    v-titlebar-draggable></div>
            </Flex>
        </Flex>
    </ClientOnly>
</template>