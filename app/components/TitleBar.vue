<script setup lang="ts">
import Home from '@fluentui/svg-icons/icons/home_24_regular.svg?raw'
import ChevronRight from '@fluentui/svg-icons/icons/chevron_right_24_regular.svg?raw'
import SettingsIcon from '@fluentui/svg-icons/icons/settings_24_regular.svg?raw'
import { Categories } from '~/utils/pages/info'
import { Apps } from '~/utils/pages/app'
const tool = usePageInfo()
</script>
<template>
    <div class="h-titlebar-height"></div>
    <ClientOnly>
        <Flex class="titlebar fixed top-0 left-0 right-0 h-titlebar-height">
            <div style="width: var(--app-titlebar-reserved-area-left, 0px);" v-titlebar-draggable></div>
            <Flex class="gap-1 items-center backdrop-blur-lg rounded-br-md pr-2">
                <Control variant="ghost" class="px-2 py-0 h-full flex gap-1 items-center rounded-0 border-transparent">
                    <OurLink class="manual" tabindex="0" href="/">
                        <Icon :icon=Home alt="Home" />
                        SimplyTools
                    </OurLink>
                </Control>
                <template v-for="(breadcrumbItem, index) in tool.breadcrumb" :key="index">
                    <Icon :icon=ChevronRight alt="to" />
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