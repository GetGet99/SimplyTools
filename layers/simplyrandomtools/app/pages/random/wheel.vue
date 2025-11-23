<template>
    <RandomHeroPage toolname="wheel">
        <template v-slot="{ list }">
            <RandomWheel :list />
        </template>
        <template #summary>
            This tool allows you to spin a wheel to select a random item from your list.
        </template>
        <template #details>
            <p>Make a list of items you want to include in the wheel.</p>
            <p>Wheel Spinner: Spin the wheel to randomly select an item from your list. The wheel will slow down and eventually stop on a random item.</p>
        </template>
    </RandomHeroPage>
</template>