<template>
    <Feature category="dev" tool="Under Construction">
        <Flex column class="items-center justify-center gap-4 p-8">
            <h2 class="text-2xl font-bold">This page is under construction.</h2>
            <p class="text-center max-w-lg">We're working hard to bring you this feature. Please check back later!</p>
        </Flex>
    </Feature>
</template>
<!-- <template>
    <div class="blockly-container" ref="blocklyDiv" style="height: 100vh; width: 100vw;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// Import Blockly core
import * as Blockly from 'blockly/core'
import * as En from 'blockly/msg/en'
import DarkTheme from '@blockly/theme-dark'
import 'blockly/blocks'
import 'blockly/javascript'

const blocklyDiv = ref(null)
let workspace = null
onMounted(() => {
    Blockly.setLocale(En);
    workspace = Blockly.inject(blocklyDiv.value, {
        theme: DarkTheme,
        toolbox: {
            "kind": "flyoutToolbox",
            "contents": [
                {
                    "kind": "block",
                    "type": "controls_if"
                },
                {
                    "kind": "block",
                    "type": "logic_compare"
                },
                {
                    "kind": "block",
                    "type": "math_number"
                },
                {
                    "kind": "block",
                    "type": "text"
                }
            ]
        }
    })
})
</script>
<style>
@reference '~~/layers/simplytools-ui/app/app.css';

.blocklySvg {
    background: transparent !important;
}

.blocklyFlyoutBackground {
    background: transparent !important;
    fill: transparent !important;
    backdrop-filter: blur(16px);
}
</style> -->