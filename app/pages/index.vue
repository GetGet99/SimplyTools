<script setup lang="ts">
import { Categories } from '~/utils/pages/info';
useHead({
    title: 'SimplyTools'
})
</script>

<template>
    <Grid rows="auto auto grow auto" class="w-full min-h-screen gap-2">
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
        <Flex column>
            <Grid as="main" :columns="1" :md-columns="2" :lg-columns="3" class="mx-2 sm:mx-30 my-2 gap-4">
                <template v-for="cat in Categories">
                    <FeatureCard v-for="page in cat.pages" :title="page.title" :href="`${cat.path}/${page.path}`">
                        <span v-html="page.desc"></span>
                    </FeatureCard>
                </template>
            </Grid>
        </Flex>
        <Footer />
    </Grid>
</template>