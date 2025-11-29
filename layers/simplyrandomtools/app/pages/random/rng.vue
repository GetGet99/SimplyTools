<script setup lang="ts">
usePageInfo(RandomCategory.pages.find(x => x.path === 'rng'))
const mode = ref<'integer' | 'real'>('integer')
const valFrom = ref<number | undefined>(1)
const valTo = ref<number | undefined>(10)
const count = ref(1)
const fromTb = useTemplateRef('from')
const toTb = useTemplateRef('to')
const genCountTb = useTemplateRef('genCount')
const autoClear = ref(false)
const history = ref('')
const latestNumber = ref(undefined as number | undefined)
watch(mode , () => {
    latestNumber.value = undefined
})
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
    const wasEmpty = autoClear.value || history.value == ""
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
    displayRef.value?.animateSameNumber()
    if (wasEmpty) {
        // removes the first \n
        outStr = outStr.substring(1)
    }
    if (autoClear.value)
        history.value = outStr
    else
        history.value += outStr
}
function copyValue() {
    navigator.clipboard.writeText(latestNumber.value?.toString() ?? '')
}
const displayRef = useTemplateRef('display')
</script>
<template>
    <Feature category="none" tool="RNG" class="flex justify-center">
        <Card class="p-5">
            <Grid columns="auto" md-columns="auto 200px" class="gap-2">
                <!-- NavigationTabs -->
                <NavigationTabs v-model="mode" :options="['integer', 'real']" class="md:col-span-2" />
                <Grid columns="200px auto" class="gap-2 items-center h-min">
                    <span>From:</span>
                    <NumberBox ref="from" :mode v-model="valFrom" class="grow w-20 ml-auto"
                        placeholder="From (Required)" />
                    <span>To:</span>
                    <NumberBox ref="to" :mode v-model="valTo" class="grow w-20 ml-auto" placeholder="To (Required)" />
                    <span class="leading-5">Generated count:<br /><span class="text-placeholder text-xs">They
                            will be in history section.</span></span>
                    <NumberBox ref="genCount" :mode v-model="count" class="inline-block w-20"
                        placeholder="Generate Count (Required)" />
                </Grid>
                <Flex column class="items-center gap-2">
                    <Grow />
                    <RandomScrambleNumber ref="display"
                        :class="[mode === 'integer' ? 'text-5xl' : 'text-body', latestNumber === undefined ? 'opacity-0' : undefined]"
                        :integer="mode === 'integer'" :number="latestNumber ?? 0"
                        :max="Math.max(valFrom ?? 0, valTo ?? 0)" :min="Math.min(valFrom ?? 0, valTo ?? 0)" />
                    <Grow />
                    <Flex class="gap-2 mt-2">
                        <Button title="Copy" icon="left" class="rounded-control" @click="copyValue"
                            :disabled="latestNumber === undefined">
                            <IconCopy alt="" />
                            Copy
                        </Button>
                        <Button class="p-button rounded-control" @click="generate">Generate</Button>
                    </Flex>
                </Flex>
            </Grid>
            <RandomHistory v-model="history" />
        </Card>
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