<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ number: number, min: number, max: number, integer: boolean }>();

const displayNumber = ref(props.number);
const isAnimating = ref(false);

watch(
    () => props.number,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            animateNumber(oldVal, newVal);
        }
    }
);

function animateNumber(oldVal: number, newVal: number) {
    isAnimating.value = true;
    let scrambleCount = 0;
    const scrambleInterval = setInterval(() => {
        // Randomize between old and new for a "shaking" effect
        if (props.integer)
            displayNumber.value = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;
        else
            displayNumber.value = Math.random() * (props.max - props.min) + props.min;

        scrambleCount++;
        if (scrambleCount > 10) {
            clearInterval(scrambleInterval);
            displayNumber.value = newVal;
            isAnimating.value = false;
        }
    }, 50);
}
function animateSameNumber() {
    if (!isAnimating.value) {
        animateNumber(props.number, props.number);
    }
}
defineExpose({ animateSameNumber })
</script>

<template>
    <span class="inline-block transition-transform duration-300"
        :class="{
            'scale-110 rotate-2': isAnimating && !integer,
            'scale-125 -rotate-3': isAnimating && integer
        }">
        {{ displayNumber }}
    </span>
</template>
