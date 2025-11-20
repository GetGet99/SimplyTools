<template>
    <Feature category="none" tool="Timestamps" class="flex flex-col items-center gap-2">
        <label class="block font-medium">Select the time in your local time zone!</label>

        <DatePickerRoot v-model="dt" granularity="second" hideTimeZone>
            <DatePickerField v-slot="{ segments }"
                class="w-min flex items-center gap-0.5 style-textbox focus-within:utils-style-textbox-focus">
                <ClientOnly>
                    <template v-for="item in segments" :key="item.part">
                        <DatePickerInput v-if="item.part === 'literal'" :part="item.part">
                            {{ item.value }}
                        </DatePickerInput>
                        <template v-else>
                            <div v-if="item.part === 'timeZoneName'">(</div>
                            <DatePickerInput :part="item.part"
                                class="rounded outline-offset-2 data-[placeholder]:text-placeholder">
                                {{ item.value }}
                            </DatePickerInput>
                            <div v-if="item.part === 'timeZoneName'">)</div>
                        </template>
                    </template>

                    <DatePickerTrigger as-child>
                        <Button class="p-0 -my-1 -mr-1" title="Open Calendar">
                            <IconCalendar alt="" />
                        </Button>
                    </DatePickerTrigger>
                    <template #fallback>
                        Loading...
                    </template>
                </ClientOnly>
            </DatePickerField>

            <DatePickerContent :side-offset="4"
                class="rounded-xl bg-control-primary backdrop-blur-md border border-border-control-primary shadow-sm will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade">
                <DatePickerArrow class="fill-border-control-primary border-border-control-primary" />
                <DatePickerCalendar v-slot="{ weekDays, grid }" class="p-4">
                    <DatePickerHeader class="flex items-center justify-between">
                        <DatePickerPrev as-child>
                            <Button class="p-button-icon">
                                <IconChevronLeft alt="" />
                            </Button>
                        </DatePickerPrev>

                        <DatePickerHeading class="font-medium" />
                        <DatePickerNext as-child>
                            <Button class="p-button-icon">
                                <IconChevronRight alt="" />
                            </Button>
                        </DatePickerNext>
                    </DatePickerHeader>
                    <Flex column class="space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <DatePickerGrid v-for="month in grid" :key="month.value.toString()"
                            class="w-full border-collapse select-none space-y-1">
                            <DatePickerGridHead>
                                <DatePickerGridRow class="mb-1 flex w-full justify-between">
                                    <DatePickerHeadCell v-for="day in weekDays" :key="day"
                                        class="w-8 rounded-md font-normal">
                                        {{ day }}
                                    </DatePickerHeadCell>
                                </DatePickerGridRow>
                            </DatePickerGridHead>
                            <DatePickerGridBody>
                                <DatePickerGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`"
                                    class="flex w-full">
                                    <DatePickerCell v-for="weekDate in weekDates" :key="weekDate.toString()"
                                        :date="weekDate">
                                        <DatePickerCellTrigger :day="weekDate" :month="month.value"
                                            class="relative flex items-center justify-center whitespace-nowrap rounded-[9px] border border-transparent bg-transparent font-normal  w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-border-control-primary hover:border-border-control-primary data-[selected]:bg-accent-primary data-[selected]:hover:bg-accent-secondary data-[selected]:active:bg-accent-secondary data-[outside-view]:opacity-30 data-[selected]:text-white data-[unavailable]:pointer-events-none data-[unavailable]:/30 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:data-[today]:before:block data-[today]:before:bg-green9 data-[selected]:before:bg-white" />
                                    </DatePickerCell>
                                </DatePickerGridRow>
                            </DatePickerGridBody>
                        </DatePickerGrid>
                    </Flex>
                </DatePickerCalendar>
            </DatePickerContent>
        </DatePickerRoot>
        <!-- <Flex class="mb-4 items-center">
            <label class="mr-2 font-medium">UNIX Timestamp:</label>
            <TextBox :model-value="unixTimestamp.toString()" readonly class="w-24 mr-2 px-2 py-1 border rounded" />
            <Button class="p-button-icon" @click="copyToClipboard(unixTimestamp)">
                <Icon :icon="CopyIcon" alt="Copy" />
            </Button>
        </Flex> -->
        <h2 class="font-semibold">Timestamp Formats</h2>
        <Grid columns="auto auto auto" class="gap-4 justify-center items-center">
            <div>Format</div>
            <div>Preview</div>
            <div>Other Options</div>
            <template v-for="option in discordOptions" :key="option.discordFormat">
                <div>{{ option.label }}</div>
                <Flex class="gap-2 items-center">
                    <div class="select-text">
                        <span class="bg-control-primary w-min p-1 rounded-1">
                            <ClientOnly>
                                {{ option.example(dt?.toDate() ?? new Date(), currentTime) }}
                                <template #fallback>
                                    Loading...
                                </template>
                            </ClientOnly>
                        </span>
                    </div>
                    <Button @click="copyToClipboard(option.example(dt?.toDate() ?? new Date(), currentTime))"
                        class="p-button-icon" title="Copy Preview Text">
                        <IconCopy alt="Copy Preview Text" />
                    </Button>
                </Flex>
                <Flex class="gap-2">
                    <Button v-if="option.discordCode" @click="copyToClipboard(option.discordCode)" class="flex gap-1">
                        Discord
                    </Button>
                    <Button v-if="option.js" @click="copyToClipboard(option.js)" class="flex gap-1">
                        JS
                    </Button>
                </Flex>
            </template>
        </Grid>
        <template #summary>
            Convert dates and times to UNIX timestamps and Discord timestamp formats, with instant previews and copy buttons.
        </template>
        <template #details>
            <p>
                This tool lets you select a date and time in your local timezone, then instantly view and copy the corresponding UNIX timestamp and various Discord timestamp formats.
            </p>
            <ul>
                <li>Preview how your timestamp will appear in Discord for different formats (short/long date, time, relative, etc).</li>
                <li>Copy ready-to-use Discord timestamp codes and JavaScript snippets for your selected date and time.</li>
                <li>Supports second-level granularity and live previews as you adjust the date/time.</li>
            </ul>
            <p>
                Useful for developers, Discord server admins, and anyone needing to convert or format timestamps for chat, bots, or code.
            </p>
        </template>
    </Feature>
</template>

<script setup lang="ts">
import { ZonedDateTime, now, getLocalTimeZone } from '@internationalized/date'

import { Uncategorized } from '~/utils/pages/uncategorized'
setPageInfo(Uncategorized.pages.find(x => x.path === 'timestamp'))

interface Time {
    hours: number
    minutes: number
    seconds: number
}

interface Formatter {
    discordFormat?: string
    label: string
    example(date: Date, currentTime: Date): string
    jsTemplate?(date: Date): string
}

interface WithExportOption extends Formatter {
    discordCode?: string
    js?: string
}

// Use CalendarDate for date, and IntlTime for time
const dt = shallowRef<ZonedDateTime | undefined>(undefined)
const currentTime = ref<Date>(new Date(0))
let timeout: NodeJS.Timeout
onMounted(() => {
    dt.value = now(getLocalTimeZone())
    timeout = setInterval(() => {
        currentTime.value = new Date()
    }, 1000)

})
onUnmounted(() => clearInterval(timeout))

const unixTimestamp = computed<number>(() => {
    // Discord expects UTC timestamp
    const jsDate = dt.value?.toDate()
    return Math.floor((jsDate?.getTime() ?? 0) / 1000)
})
const discordFormats: Formatter[] = [
    {
        label: 'Unix Timestamp',
        example: (date: Date) => Math.floor(date.getTime() / 1000).toString(),
        jsTemplate: (d) => `Math.floor(new Date(${d.getTime()}).getTime() / 1000).toString()`
    },
    {
        discordFormat: 't',
        label: 'Short Time',
        example: (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jsTemplate: (d) => `new Date(${d.getTime()}).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`
    },
    {
        discordFormat: 'T',
        label: 'Long Time',
        example: (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        jsTemplate: (d) => `new Date(${d.getTime()}).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })`
    },
    {
        discordFormat: 'd',
        label: 'Short Date',
        example: (date: Date) => date.toLocaleDateString(),
        jsTemplate: (d) => `new Date(${d.getTime()}).toLocaleDateString()`
    },
    {
        discordFormat: 'D',
        label: 'Long Date',
        example: (date: Date) => date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }),
        jsTemplate: (d) => `new Date(${d.getTime()}).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })`
    },
    {
        discordFormat: 'f',
        label: 'Short Date/Time',
        example: (date: Date) => date.toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        jsTemplate: (d) => `new Date(${d.getTime()}).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })`
    },
    {
        discordFormat: 'F',
        label: 'Long Date/Time',
        example: (date: Date) => date.toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        jsTemplate: (d) => `new Date(${d.getTime()}).toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })`
    },
    {
        discordFormat: 'R',
        label: 'Relative Time',
        example: (date: Date, currentTime: Date) => {
            const diff = Math.floor((currentTime.getTime() - date.getTime()) / 1000)
            const absDiff = Math.abs(diff)
            const future = diff < 0
            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

            if (absDiff < 60)
                return rtf.format(future ? absDiff : -absDiff, 'second')
            if (absDiff < 3600)
                return rtf.format(future ? Math.floor(absDiff / 60) : -Math.floor(absDiff / 60), 'minute')
            if (absDiff < 86400)
                return rtf.format(future ? Math.floor(absDiff / 3600) : -Math.floor(absDiff / 3600), 'hour')
            if (absDiff < 2592000)
                return rtf.format(future ? Math.floor(absDiff / 86400) : -Math.floor(absDiff / 86400), 'day')
            if (absDiff < 31536000)
                return rtf.format(future ? Math.floor(absDiff / 2592000) : -Math.floor(absDiff / 2592000), 'month')
            return rtf.format(future ? Math.floor(absDiff / 31536000) : -Math.floor(absDiff / 31536000), 'year')
        },
        jsTemplate: (d) => `(() => {
            const diff = Math.floor((Date.now() - new Date(${d.getTime()}).getTime()) / 1000)
            const absDiff = Math.abs(diff)
            const future = diff < 0
            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

            if (absDiff < 60)
                return rtf.format(future ? absDiff : -absDiff, 'second')
            if (absDiff < 3600)
                return rtf.format(future ? Math.floor(absDiff / 60) : -Math.floor(absDiff / 60), 'minute')
            if (absDiff < 86400)
                return rtf.format(future ? Math.floor(absDiff / 3600) : -Math.floor(absDiff / 3600), 'hour')
            if (absDiff < 2592000)
                return rtf.format(future ? Math.floor(absDiff / 86400) : -Math.floor(absDiff / 86400), 'day')
            if (absDiff < 31536000)
                return rtf.format(future ? Math.floor(absDiff / 2592000) : -Math.floor(absDiff / 2592000), 'month')
            return rtf.format(future ? Math.floor(absDiff / 31536000) : -Math.floor(absDiff / 31536000), 'year')
    })()`
    }
]

const discordOptions = computed<WithExportOption[]>(() =>
    discordFormats.map(f => ({
        ...f,
        discordCode: f.discordFormat && `<t:${unixTimestamp.value}:${f.discordFormat}>`,
        js: f.jsTemplate && f.jsTemplate(dt.value?.toDate() ?? new Date())
    }))
)

const copied = ref<boolean>(false)
function copyToClipboard(text: string | number) {
    navigator.clipboard.writeText(String(text))
    copied.value = true
    setTimeout(() => copied.value = false, 1200)
}
</script>