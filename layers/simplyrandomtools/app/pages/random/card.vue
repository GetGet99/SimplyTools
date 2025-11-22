<template>
    <RandomHeroPage toolname="card" v-slot="{ list }">
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
    </RandomHeroPage>
</template>