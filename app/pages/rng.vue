<script setup lang="ts">
    import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
    import DeleteIcon from '@fluentui/svg-icons/icons/delete_24_regular.svg?raw'
    const mode = ref<'integer' | 'real'>('integer')
    const valFrom = ref<number | undefined>(1)
    const valTo = ref<number | undefined>(10)
    const count = ref(1)
    const fromTb = useTemplateRef('from')
    const toTb = useTemplateRef('to')
    const genCountTb = useTemplateRef('genCount')
    const autoClear = ref(true)
    const output = ref('')
    const outputTb = useTemplateRef('outputTb')
    function generate() {
        if (valFrom.value === undefined) {
            (fromTb.value! as any as HTMLInputElement).focus()
            return
        }
        if (valTo.value === undefined) {
            (toTb.value! as any as HTMLInputElement).focus()
            return
        }
        if (count.value === undefined) {
            (genCountTb.value! as any as HTMLInputElement).focus()
            return
        }
        const wasEmpty = autoClear.value || output.value == ""
        let outStr = ""
        if (mode.value === "integer") {
            for (let i = 0; i < count.value; i++) {
                outStr += "\n" + rng.randrangeint(valFrom.value, valTo.value).toString()
            }
        } else {
            for (let i = 0; i < count.value; i++) {
                outStr += "\n" + rng.randrangefloat(valFrom.value, valTo.value).toString()
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
    function copy() {
        (outputTb.value! as any as HTMLTextAreaElement).focus();
        (outputTb.value! as any as HTMLTextAreaElement).select();
        document.execCommand('copy')
    }
</script>
<template>
    <Feature category="none" tool="RNG" class="flex justify-center">
        <div class="flex flex-col items-center gap-4 w-fit">
            <span>Generate me random <ToggleGroupRoot class="inline-flex" v-model="mode">
                    <ToggleGroupItem value="integer" as-child>
                        <Button :varient="mode === 'integer' ? 'accent' : 'control'"
                            class="p-button inline-block rounded-r-none" @click="mode = 'integer'">Integer</Button>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="real" as-child>
                        <Button :varient="mode === 'real' ? 'accent' : 'control'"
                            class="p-button inline-block rounded-l-none" @click="mode = 'real'">Real Number</Button>
                    </ToggleGroupItem>
                </ToggleGroupRoot>
            </span>
            <div class="grid grid-cols-2 gap-4">
                <div class="flex gap-1 items-center">From:
                    <NumberBox ref="from" :mode v-model="valFrom" class="grow w-full" placeholder="From (Required)" />
                </div>
                <div class="flex gap-1 items-center">To:
                    <NumberBox ref="to" :mode v-model="valTo" class="grow w-full" placeholder="To (Required)" />
                </div>
            </div>
            <span>
                Generate me
                <NumberBox ref="genCount" :mode v-model="count" class="inline-block w-fit"
                    placeholder="Generate Count (Required)" /> numbers
            </span>
            <Button class="p-button rounded-control" @click="generate">Generate</Button>
            <TextBox ref="outputTb" :model-value="output" multiline class="w-full" readonly
                placeholder='Press "Generate" button above!' />
            <div class="w-full flex justify-end gap-2 -mt-2">
                <Button :varient="autoClear ? 'accent' : 'control'" class="p-button rounded-control"
                    @click="autoClear = !autoClear">
                    Auto Clear: {{ autoClear ? 'On' : 'Off' }}
                </Button>
                <Button title="Copy" class="p-button-icon rounded-control" @click="copy">
                    <Icon alt="" :icon=CopyIcon />
                </Button>
                <Button title="Clear" class="p-button-icon rounded-control" @click="output = ''">
                    <Icon alt="" :icon=DeleteIcon />
                </Button>
            </div>
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