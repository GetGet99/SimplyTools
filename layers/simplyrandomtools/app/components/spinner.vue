<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  list: string[]
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

const rolling = ref(false)
const spinningIndex = ref(0)
const itemHeight = 64 // matches Tailwind h-16
const totalHeight = computed(() => props.list.length * itemHeight)

function rollForItem(target: undefined | number = undefined): number | undefined {
  if (rolling.value || props.list.length === 0) return

  rolling.value = true
  const len = props.list.length
  const SNAP_DURATION = 500
  const TOTAL_DURATION = 8000
  const spinDuration = Math.max(0, TOTAL_DURATION - SNAP_DURATION)
  const minItemsPassed = 50
  const fullSpins = 16

  // get a float target; subtract 0.5 so final Math.round won't always floor
  const randomFloat = (target !== undefined ? target - 0.5 : Math.random() * len - 0.5)
  const finalIndex = ((Math.round(randomFloat) % len) + len) % len

  const start = performance.now()
  const startOffset = spinningIndex.value
  // compute base distance using fullSpins, then ensure it's at least minItemsPassed
  let totalDistance = randomFloat - startOffset + fullSpins * len
  if (totalDistance < minItemsPassed) {
    const neededSpins = Math.ceil((minItemsPassed - (randomFloat - startOffset)) / len)
    const adjustedSpins = Math.max(fullSpins, neededSpins)
    totalDistance = randomFloat - startOffset + adjustedSpins * len
  }

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3)
  }
  
  function easeLinear(t: number) {
    return t
  }

  function startSnap(currentAbsolute: number) {
    const currentNormalized = ((currentAbsolute % len) + len) % len
    const snapIndex = finalIndex

    // choose the shortest wrap direction to reach snapIndex
    let delta = snapIndex - currentNormalized
    if (delta > len / 2) delta -= len
    else if (delta < -len / 2) delta += len

    const snapTargetAbsolute = currentAbsolute + delta
    const snapStart = performance.now()

    function snapAnimate(now: number) {
      const elapsed = now - snapStart
      const t = Math.min(elapsed / SNAP_DURATION, 1)
      const eased = easeLinear(t)
      spinningIndex.value = currentAbsolute + delta * eased

      if (t < 1) {
        requestAnimationFrame(snapAnimate)
      } else {
        // normalize final value to [0, len)
        spinningIndex.value = ((snapTargetAbsolute % len) + len) % len
        rolling.value = false
        emit('select', snapIndex)
      }
    }

    requestAnimationFrame(snapAnimate)
  }

  if (spinDuration <= 0) {
    // no spin phase, jump straight to snap
    const endAbsolute = startOffset + totalDistance
    startSnap(endAbsolute)
  } else {
    function spinAnimate(now: number) {
      const elapsed = now - start
      const t = Math.min(elapsed / spinDuration, 1)
      const eased = easeOutCubic(t)
      spinningIndex.value = startOffset + totalDistance * eased

      if (t < 1) {
        requestAnimationFrame(spinAnimate)
      } else {
        const endAbsolute = startOffset + totalDistance
        startSnap(endAbsolute)
      }
    }

    requestAnimationFrame(spinAnimate)
  }

  return finalIndex
}

defineExpose({ rollForItem })

const ADJUSTMENT = -17
const MINTRANSLATION = -totalHeight.value
const MAXTRANSLATION = itemHeight + -ADJUSTMENT
const finalTranslation = computed(() => {
  const base = - ((spinningIndex.value - 1) * itemHeight) + ADJUSTMENT
  const mod = totalHeight.value || 1
  // wrap base into the interval [MINTRANSLATION, MINTRANSLATION + totalHeight)
  let translation = (((base - MINTRANSLATION) % mod) + mod) % mod + MINTRANSLATION

  // safety adjust to ensure final value lives between MINTRANSLATION and MAXTRANSLATION
  if (translation < MINTRANSLATION) {
    translation += totalHeight.value
  } else if (translation > MAXTRANSLATION) {
    translation -= totalHeight.value
  }
  if (translation < MINTRANSLATION) {
    debugger
  } else if (translation > MAXTRANSLATION) {
    debugger
  }
  return translation
})
</script>

<template>
  <Card class="p-0 relative h-40 overflow-hidden rounded-2xl">
    <div class="w-max inset-0 flex flex-col items-center will-change-transform" :style="{
      transform: `translateY(${finalTranslation}px)`
    }">
      <template v-for="n in (list.length > 1 ? 5 : 10)" :key="n">
        <div v-for="(item, i) in list" :key="i"
          class="min-w-40 h-16 mx-5 flex items-center justify-center text-white text-2xl font-bold">
          {{ item }}
        </div>
      </template>
    </div>

    <!-- Center highlight -->
    <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 border-y-4 border-accent-primary pointer-events-none">
    </div>
  </Card>
</template>
