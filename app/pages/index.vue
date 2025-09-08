<script setup lang="ts">
import { Categories } from '~/utils/pages/info';
useHead({
    title: 'SimplyTools'
})
</script>

<template>
    <div class="w-full min-h-screen grid grid-rows-[auto_auto_minmax(0,_1fr)_auto] gap-2">
        <TitleBar />
        <h1 class="p-5 text-center app:hidden">
            SimplyTools
        </h1>
        <div class="app:hidden">
            <h2 class="h5 text-center">Free tools locally run in your browser!</h2>
            <noscript class="h2 text-danger">
                <div class="text-center">JavaScript is required for the most part of the site. All tools are written to
                    work
                    locally via JavaScript.</div>
            </noscript>
        </div>
        <div class="flex flex-col">
            <main class="mx-2 sm:mx-30 my-2 grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                <template v-for="cat in Categories">
                    <FeatureCard v-for="page in cat.pages" :title="page.title" :href="`${cat.path}/${page.path}`">
                        <span v-html="page.desc"></span>
                    </FeatureCard>
                </template>
            </main>
        </div>
        <Footer />
    </div>
</template>