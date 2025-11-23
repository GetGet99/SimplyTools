<template>
    <RandomHeroPage toolname="spinner">
        <template v-slot="{ list }">
            <RandomSpinner :list />
        </template>
        <template #summary>
            This tool allows you to spin a slot machine to select a random item from your list.
        </template>
        <template #details>
            <p>Make a list of items you want to include in the slot machine.</p>
            <p>Slot Machine Spinner: Spin the slot machine to randomly select an item from your list. The slot machine will spin and eventually stop on a random item.</p>
        </template>
    </RandomHeroPage>
</template>