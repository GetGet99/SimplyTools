<template>
    <RandomHeroPage toolname="card" details-visible="always">
        <template v-slot="{ list }">
            <div class="w-full max-w-3xl p-4">
                <h2 class="text-lg font-semibold mb-2">Card Picker</h2>
                <div class="mb-4">
                    <Grid :columns="1" :sm-columns="3" class="gap-4">
                        <Button v-for="idx in 3" :key="idx" disabled class="min-h-60">
                            {{ list[idx] }}
                        </Button>
                    </Grid>
                </div>
            </div>
        </template>
        <template #summary>
            This tool allows you to pick random cards from your list.
        </template>
        <template #details>
            <p>Make a list of items you want to include in the card picker.</p>
            <p>Card Picker: you'll be provided 3 cards that are randomly chosen from the list. Select one to continue.</p>
            <p>There are 3 modes of operation.</p>
            <ul class="list-disc list-inside">
                <li><strong>Progressive Weight (Default):</strong> After selecting a card, the probability of that card being selected again is reduced.</li>
                <li><strong>With Replacement:</strong> After selecting a card, it remains in the list and can be picked again.</li>
                <li><strong>Remove from list:</strong> After selecting a card, you will not be shown that card again.</li>
            </ul>
        </template>
    </RandomHeroPage>
</template>