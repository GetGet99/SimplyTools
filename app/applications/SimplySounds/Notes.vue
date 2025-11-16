<template>
    <Flex column class="gap-2 items-center border border-border-control-primary p-2 rounded bg-control-primary w-fit">
        <div v-if="!previewMode" class="italic">Tap/Left click to add. Right click to preview notes.</div>
        <div v-else class="italic">Tap/Left click to preview notes.</div>
        <Flex class="gap-4 items-center justify-center flex-wrap">
            <Flex class="gap-2">
                <Button v-for="type in SimplySounds.synthTypes" :key="type"
                    :variant="synthType === type ? 'accent' : 'regular'" @click="synthType = type">
                    {{ type }}
                </Button>
            </Flex>
        </Flex>
        <Flex class="gap-2">
            <Button @click="previewMode ? handleSpecialPreview('Silent') : SimplySounds.addItemToSelected('Silent')"
                :class="{ jumping: jumpingSpecial === 'Silent' }" @contextmenu.prevent="handleSpecialPreview('Silent')">
                Silent
            </Button>
            <Button @click="previewMode ? handleSpecialPreview('Hold') : SimplySounds.addItemToSelected('Hold')"
                :class="{ jumping: jumpingSpecial === 'Hold' }" @contextmenu.prevent="handleSpecialPreview('Hold')">
                Hold
            </Button>
        </Flex>
        <Grid :columns="7" class="gap-2 max-h-35 overflow-auto">
            <template v-for="n in SimplySounds.notes" :key="n">
                <Button v-if="!n.includes('#')" :class="{ jumping: jumpingNote === n }"
                    @click="previewMode ? SimplySounds.playSpecificNote(n) : (SimplySounds.addItemToSelected(n), SimplySounds.playSpecificNote(n, undefined, undefined, false))"
                    @contextmenu.prevent="SimplySounds.playSpecificNote(n)">
                    {{ n }}
                </Button>
            </template>
        </Grid>
    </Flex>
</template>
<script setup lang="ts">
import * as SimplySounds from './shared';
const previewMode = SimplySounds.previewMode
const jumpingSpecial = SimplySounds.jumpingSpecial
const jumpingNote = SimplySounds.jumpingNote
const synthType = SimplySounds.synthType

function handleSpecialPreview(s: SimplySounds.Special) {
    jumpingSpecial.value = s
    setTimeout(() => {
        if (jumpingSpecial.value === s) jumpingSpecial.value = null
    }, SimplySounds.jumpDuration)
    // no sound for silent/hold
}
</script>