<script setup lang="ts">
import Home from '@fluentui/svg-icons/icons/home_24_regular.svg?raw'
import ChevronRight from '@fluentui/svg-icons/icons/chevron_right_24_regular.svg?raw'
import SettingsIcon from '@fluentui/svg-icons/icons/settings_24_regular.svg?raw'
import { Categories } from '~/utils/pages/info'
const tool = usePageInfo()
</script>
<template>
    <div class="h-[max(30px,_var(--app-titlebar-height,_0px))]"></div>
    <div class="titlebar fixed top-0 left-0 right-0 flex h-[max(30px,_var(--app-titlebar-height,_0px))]">
        <div style="width: var(--app-titlebar-reserved-area-left, 0px);" v-titlebar-draggable></div>
        <div class="flex gap-1 items-center backdrop-blur-lg rounded-br-md pr-2">
            <Control class="p-button-icon py-[3px] bg-transparent border-transparent flex gap-2 rounded-0">
                <OurLink class="manual" tabindex="0" href="/">
                    <Icon :icon=Home alt="Home" />
                    SimplyTools
                </OurLink>
            </Control>
            <template v-if="tool.breadcrumb.length >= 2 && tool.toolName">
                <Icon :icon=ChevronRight alt="to" />
                <OurLink class="manual p-2 pointer-events-none" :href="`/${tool.catPath}`">
                    {{ tool.breadcrumb[0] }}
                </OurLink>
            </template>
            <template v-if="tool.breadcrumb.length >= 1">
                <Icon :icon=ChevronRight alt="to" />
                <OurLink class="manual p-2 pointer-events-none" :href="`/${tool.toolPath}`">
                    {{ tool.breadcrumb[tool.breadcrumb.length - 1]! }}
                </OurLink>
            </template>
        </div>
        <div class="grow h-full" v-titlebar-draggable></div>
        <div class="backdrop-blur-lg flex rounded-bl-md "> <!--pl-2-->
            <SettingsDialog>
                <template #trigger>
                    <DialogTrigger as-child>
                        <Button class="hidden p-[3px] bg-transparent border-transparent" title="Settings">
                            <Icon :icon=SettingsIcon alt="" />
                        </Button>
                    </DialogTrigger>
                </template>
            </SettingsDialog>
            <div class="app:w-60" style="width: var(--app-titlebar-reserved-area-right, 250px);" v-titlebar-draggable></div>
        </div>
    </div>
</template>