<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getListAsync, useRandomListItemPageAsync } from '~/utils/random/listManager'

const id = await useRandomListItemPageAsync('card')
const rawList = ref(await getListAsync(id))

// normalize to { id: string, text: string }
const items = computed(() => {
    const r = rawList.value || []
    if (!Array.isArray(r)) return []
    return r.map((it: any, i: number) => {
        if (typeof it === 'string') return { id: String(i), text: it }
        if (it && (it.id || it.key)) return { id: String(it.id ?? it.key ?? i), text: String(it.text ?? it.value ?? it.name ?? it.label ?? JSON.stringify(it)) }
        return { id: String(i), text: String(it) }
    })
})

type Mode = 'default' | 'remove' | 'replacement'

const mode = ref<Mode>('default')
const modeLocked = ref(false)

const modes = (['default', 'remove', 'replacement'] as const)

function labelForMode(v: Mode) {
    return v === 'default' ? 'Progressive Weight' : v === 'remove' ? 'Remove from list' : 'With replacement'
}

// For 'default' mode we track how many times an item was selected
const selectCount = ref<Record<string, number>>({})
// For 'remove' mode we track removed ids
const removed = ref<Record<string, boolean>>({})

const cards = ref<Array<{ id: string; text: string }>>([])
const selectedIndex = ref<number | null>(null)

function weightFor(id: string) {
    if (removed.value[id]) return 0
    if (mode.value === 'replacement') {
        return 1
    }
    // default: progressive weight based on how many times it was selected
    const n = selectCount.value[id] ?? 0
    return 1 / (n + 1)
}

function sampleOne(excludeIds = new Set<string>()) {
    const pool = items.value.filter(it => !excludeIds.has(it.id) && !removed.value[it.id])
    const ws = pool.map(it => ({ it, w: weightFor(it.id) }))
    const total = ws.reduce((s, x) => s + x.w, 0)
    if (total === 0 || ws.length === 0) return null
    let r = Math.random() * total
    for (const entry of ws) {
        r -= entry.w
        if (r <= 0) return entry.it
    }
    if (ws.length === 0) return null
    const last = ws[ws.length - 1]
    return last ? last.it : null
}

function pickN(n = 3) {
    const picked: Array<{ id: string; text: string }> = []
    const excluded = new Set<string>()
    for (let i = 0; i < n; i++) {
        const s = sampleOne(excluded)
        if (!s) break
        picked.push(s)
        excluded.add(s.id)
    }
    return picked
}

function toggleSelect(idx: number) {
    if (selectedIndex.value === idx) selectedIndex.value = null
    else selectedIndex.value = idx
}

function onNext() {
    // require a selection
    if (selectedIndex.value == null) return
    const selected = cards.value[selectedIndex.value]
    if (!selected) return

    // apply mode behavior
    if (mode.value === 'remove') {
        removed.value[selected.id] = true
    } else if (mode.value === 'default') {
        selectCount.value[selected.id] = (selectCount.value[selected.id] ?? 0) + 1
    } else if (mode.value === 'replacement') {
        // nothing to do
    }

    // lock mode after first Next
    modeLocked.value = true

    // pick new cards
    cards.value = pickN(3)
    selectedIndex.value = null
}

onMounted(() => {
    cards.value = pickN(3)
})

</script>
<template>
    <Feature class="flex flex-col gap-4 justify-center items-center" details-visible="hidden">
        <div class="w-full max-w-3xl p-4">
            <h2 class="text-lg font-semibold mb-2">Card Picker</h2>

            <ClientOnly>
                <div class="mb-4">
                    <Grid v-if="items.length > 0" :columns="1" :sm-columns="3" class="gap-4">
                        <Button v-for="(c, idx) in cards" :key="c.id" @click="toggleSelect(idx)" class="min-h-60"
                            :class="selectedIndex === idx ? 'ring-2 ring-accent-primary' : ''">
                            {{ c.text }}
                        </Button>
                    </Grid>
                    <template v-else>
                        <div class="text-center">No items in the list.</div>
                    </template>
                </div>

                <Flex class="items-center justify-center">
                    <Button :disabled="cards.length === 0 || selectedIndex == null" @click="onNext">Next</Button>
                </Flex>
                <div v-if="mode === 'remove'" class="text-sm">Remaining: {{ items.length - Object.keys(removed ||
                    {}).length }}</div>
            </ClientOnly>

            <div class="mt-6" v-if="!(modeLocked || cards.length === 0)">
                <label class="block text-sm mb-1">Mode</label>
                <div class="flex items-center gap-2">
                    <ComboBox :options="modes" v-model="mode" :disabled="modeLocked || cards.length === 0" class="w-48"
                        v-slot="{ option }">
                        <div class="text-sm text-nowrap">{{ labelForMode(option) }}</div>
                    </ComboBox>
                </div>
            </div>
        </div>
    </Feature>
</template>