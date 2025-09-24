<script setup lang="ts">
import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
import DeleteIcon from '@fluentui/svg-icons/icons/delete_24_regular.svg?raw'
import { RandomCategory } from '~/utils/pages/random'
usePageInfo(RandomCategory.pages.find(x => x.path === 'rng-multi'))
const mode = ref<'integer' | 'real'>('integer')
const valFrom = ref<number | undefined>(1)
const valTo = ref<number | undefined>(10)
const count = ref(1)
const fromTb = useTemplateRef('from')
const toTb = useTemplateRef('to')
const genCountTb = useTemplateRef('genCount')
const autoClear = ref(false)
const output = ref('')
const latestNumber = ref(undefined as number | undefined)
function generate() {
    if (valFrom.value === undefined) {
        fromTb.value?.nbb?.tb?.focus()
        return
    }
    if (valTo.value === undefined) {
        toTb.value?.nbb?.tb?.focus()
        return
    }
    if (count.value === undefined) {
        genCountTb.value?.nbb?.tb?.focus()
        return
    }
    const wasEmpty = autoClear.value || output.value == ""
    let outStr = ""
    if (mode.value === "integer") {
        for (let i = 0; i < count.value; i++) {
            latestNumber.value = rng.randrangeint(valFrom.value, valTo.value)
            outStr += "\n" + latestNumber.value.toString()
        }
    } else {
        for (let i = 0; i < count.value; i++) {
            latestNumber.value = rng.randrangefloat(valFrom.value, valTo.value)
            outStr += "\n" + latestNumber.value.toString()
        }
    }
    if (wasEmpty) {
        // removes the first \n
        outStr = outStr.substring(1)
    }
    if (autoClear.value)
        output.value = outStr
    else
        output.value += outStr
}
function copyValue() {
    navigator.clipboard.writeText(latestNumber.value?.toString() ?? '')
}
function copyHistory() {
    navigator.clipboard.writeText(output.value)
}
</script>
<template>
    <Feature category="none" tool="RNG" class="flex justify-center">
        <div class="p-5 bg-control-primary rounded-lg">
            <Grid columns="auto 200px" class="gap-2">
                <Grid columns="grow auto" class="gap-2 items-center">
                    <span>Number Mode:</span>
                    <ToggleGroupRoot class="inline-flex ml-auto" v-model="mode">
                        <ToggleGroupItem value="integer" as-child>
                            <Button :variant="mode === 'integer' ? 'accent' : 'regular'"
                                class="p-button inline-block rounded-r-none" @click="mode = 'integer'">Integer</Button>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="real" as-child>
                            <Button :variant="mode === 'real' ? 'accent' : 'regular'"
                                class="p-button inline-block rounded-l-none" @click="mode = 'real'">Real
                                Number</Button>
                        </ToggleGroupItem>
                    </ToggleGroupRoot>
                    <span>From:</span>
                    <NumberBox ref="from" :mode v-model="valFrom" class="grow w-20 ml-auto"
                        placeholder="From (Required)" />
                    <span>To:</span>
                    <NumberBox ref="to" :mode v-model="valTo" class="grow w-20 ml-auto" placeholder="To (Required)" />
                    <details class="col-span-2">
                        <summary>Advanced</summary>
                        <Grid columns="grow auto" class="gap-2 items-center justify-center">
                            <span class="leading-5">Generated count:<br /><span class="text-placeholder text-xs">They
                                    will be in history section.</span></span>
                            <NumberBox ref="genCount" :mode v-model="count" class="inline-block w-20"
                                placeholder="Generate Count (Required)" />
                        </Grid>
                    </details>
                </Grid>
                <Flex column class="items-center gap-4">
                    <Grow />
                    <RandomScrambleNumber class="text-5xl" :class="latestNumber === undefined ? 'hidden!' : ''"
                        :integer="mode === 'integer'" :number="latestNumber ?? 0"
                        :max="Math.max(valFrom ?? 0, valTo ?? 0)" :min="Math.min(valFrom ?? 0, valTo ?? 0)" />
                    <Grow />
                    <Flex class="gap-2 mt-2">
                        <Button title="Copy" icon="left" class="rounded-control" @click="copyValue"
                            :class="latestNumber === undefined ? 'hidden' : ''">
                            <Icon alt="" :icon=CopyIcon />
                            Copy
                        </Button>
                        <Button class="p-button rounded-control" @click="generate">Generate</Button>
                    </Flex>
                </Flex>
            </Grid>
            <details class="w-full">
                <summary>History</summary>
                <Flex column class="w-full gap-2">
                    <TextBox :model-value="output" multiline readonly placeholder='Press "Generate" button above!' />
                    <Flex class="w-full justify-end gap-2">
                        <Button :variant="autoClear ? 'accent' : 'regular'" class="p-button rounded-control"
                            @click="autoClear = !autoClear">
                            Auto Clear: {{ autoClear ? 'On' : 'Off' }}
                        </Button>
                        <Button title="Copy" class="p-button-icon rounded-control" @click="copyHistory">
                            <Icon alt="" :icon=CopyIcon />
                        </Button>
                        <Button title="Clear" class="p-button-icon rounded-control" @click="output = ''">
                            <Icon alt="" :icon=DeleteIcon />
                        </Button>
                    </Flex>
                </Flex>
            </details>
        </div>
        <template #summary>
            Generate random integers or real numbers within a custom range.
        </template>

        <template #details>
            <p>
                This random number generator lets you quickly produce random values for any purpose. Choose whether you
                need whole numbers (integers) or decimal values (real numbers), then set your desired range.
            </p>
            <ul>
                <li>Specify the minimum and maximum values to control the output range.</li>
                <li>Generate multiple numbers at once by entering how many results you need.</li>
                <li>Decide whether results replace the output (auto-clear) or get appended as a growing list.</li>
                <li>Easily copy the results or clear them with a single click.</li>
            </ul>
        </template>
    </Feature>
</template>