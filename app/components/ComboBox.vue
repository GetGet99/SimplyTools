<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Control from './Control.vue'
import ChevronDown from '@fluentui/svg-icons/icons/chevron_down_24_regular.svg?raw'

const props = defineProps<{
    modelValue?: string
    options: string[]
    label?: string
    placeholder?: string
    disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue ?? '')
const open = ref(false)

watch(() => props.modelValue, val => {
    selected.value = val ?? ''
})

function selectOption(option: string) {
    selected.value = option
    emit('update:modelValue', option)
    open.value = false
}

const filteredOptions = computed(() =>
    props.options.filter(opt =>
        !selected.value || opt.toLowerCase().includes(selected.value.toLowerCase())
    )
)

function onInput(e: Event) {
    selected.value = (e.target as HTMLInputElement).value
    emit('update:modelValue', selected.value)
}
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
                <Button class="flex gap-2 items-center" title="Select option" :disabled="disabled">
                    {{ selected }}
                    <Icon :icon="ChevronDown" alt="" class="w-2 scale-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent class="backdrop-blur-lg bg-control-primary border border-border-control-primary rounded-control shadow-lg max-h-60 overflow-auto w-full">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            v-for="option in filteredOptions"
                            :key="option"
                            @select="selectOption(option)"
                            class="cursor-pointer pl-2 pr-3 py-2 flex items-center gap-2 hover:bg-control-secondary"
                            :data-selected='option === selected'
                        >
                            <span
                                class="w-1 h-4 rounded-full mr-2"
                                :class="option === selected ? 'bg-accent-primary' : 'bg-control-secondary'"
                            ></span>
                            {{ option }}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenuRoot>
    </Control>
</template>