<script setup lang="ts" generic="T extends AcceptableValue | AcceptableValue[]">
import ChevronDown from '@fluentui/svg-icons/icons/chevron_down_24_regular.svg?raw'
import type { AcceptableValue } from 'reka-ui';

const props = defineProps<{
    modelValue?: T
    options: readonly T[]
    label?: string
    placeholder?: string
    disabled?: boolean
    class?: string
}>()

const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue ?? '')
const open = ref(false)

watch(() => props.modelValue, val => {
    selected.value = val ?? ''
})

function selectOption(option: T) {
    selected.value = option
    emit('update:modelValue', option)
    open.value = false
}
const selectedIndex = computed(() => {
    const idx = props.options.indexOf(selected.value)
    if (idx <= -1) {
        return 0
    }
    return idx
})
const comboboxWidth = ref(0)
const btn = useTemplateRef('btn')
</script>

<template>
    <Control :label="label">
        <DropdownMenuRoot v-model:open="open">
            <DropdownMenuTrigger as-child>
                <!-- <input
                    :value="selected"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    class="style-textbox w-full"
                    readonly
                    @focus="open = true"
                    @blur="open = false"
                    autocomplete="off"
                    tabindex="0"
                /> -->
                <Button ref="btn" class="flex gap-2 items-center justify-between" :class title="Select option" :disabled="disabled" @click="comboboxWidth = btn?.button?.clientWidth ?? 0">
                    <slot :option="selected">
                        {{ selected }}
                    </slot>
                    <Icon :icon="ChevronDown" alt="" class="w-2 scale-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent
                    class="acrylic-default border border-border-control-primary rounded-2 shadow-lg max-h-60 overflow-auto w-full" :style="{
                        translate: `0px calc(-1 * ${selectedIndex + 1}/${options.length} * 100% + 4px)`,
                        minWidth: `${comboboxWidth}px`
                    }">
                    <DropdownMenuGroup>
                        <DropdownMenuItem v-for="option in options" :key="option" @select="selectOption(option)"
                            class="pl-0 m-1 pr-3 py-2 rounded-1 flex items-center gap-2 hover:bg-control-secondary data-[selected='true']:bg-control-secondary data-[selected='true']:hover:bg-control-primary"
                            :data-selected='option === selected'>
                            <span class="w-1 h-5 rounded-full mr-0"
                                :class="option === selected ? 'bg-accent-primary' : ''"></span>
                            <slot :option>
                                {{ option }}
                            </slot>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenuRoot>
    </Control>
</template>