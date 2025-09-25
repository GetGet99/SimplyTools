<script setup lang="ts">
import './app.css'
useHead({
    bodyAttrs: {
        style: {
            'color-scheme': 'dark light'
        }
    }
})
</script>
<template>
    <Grid columns="auto grow" rows="auto auto grow" class="w-full min-h-screen bg-root text-foreground">
        <Control variant="regular"
            class="col-span-2 fixed z-1000 bg-solid-primary border-accent-primary top-[max(30px,_var(--app-titlebar-height,_0px))] -left-100 -translate-x-1/2 focus:left-1/2 transition-transform duration-100">
            <OurLink not-nuxt-link href="#main" class="manual">Press Enter or Space to skip to main content.</OurLink>
        </Control>
        <div class="col-span-2">
            <TitleBar />
        </div>
        <div class="w-80">
            <GlobalNavigationView />
        </div>
        <div class="w-full h-full bg-control-primary rounded-tl-lg">
            <ToastProvider :duration="7500">
                <ToastsGenerator>
                    <main id="main" class="w-full h-full bg-control-primary rounded-tl-lg">
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
