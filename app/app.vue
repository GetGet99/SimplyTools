<script setup lang="ts">
useHead({
    bodyAttrs: {
        style: {
            'color-scheme': 'dark light',
            'overflow': 'hidden'
        }
    }
})
</script>
<template>
    <Grid columns="auto grow" rows="auto grow" class="w-full h-screen bg-root text-foreground">
        <SkipLink to="main" />
        <SkipLink to="selected-navigation-item" />
        <div class="col-span-2">
            <TitleBar />
        </div>
        <div class="w-80 not-lg:hidden">
            <GlobalNavigationView />
        </div>
        <SkipLink to="selected-navigation-item" />
        <div class="w-full h-full bg-control-primary lg:rounded-tl-lg not-lg:col-span-2">
            <ToastProvider :duration="7500">
                <ToastsGenerator>
                    <main id="main" class="w-full h-full overflow-scroll rounded-tl-lg">
                        <NuxtPage />
                    </main>
                </ToastsGenerator>
                <Flex as-child column class="fixed bottom-0 right-0 gap-2 p-6">
                    <ToastViewport />
                </Flex>
            </ToastProvider>
        </div>
    </Grid>
</template>