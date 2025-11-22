<script setup lang="ts">
useHead({
    title: 'SimplyTools'
})
setPageInfo()
</script>

<template>
    <Grid rows="auto grow auto" class="w-full min-h-screen gap-2">
        <h1 class="pt-5 pb-3 text-center app:hidden flex gap-0.5 justify-center items-center">
            <SimplyToolsIcon class="w-15 h-15" />
            <span style="line-height: 1em;" class="-translate-y-0.5">SimplyTools</span>
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
            <Grid as="main" :columns="1" :md-columns="2" :xl-columns="3" class="mx-4 md:mx-30 my-2 gap-4">
                <template v-for="cat in Categories">
                    <FeatureCard v-if="cat !== Apps" v-for="page in cat.pages" :title="page.title"
                        :href="`${cat.path}/${page.path}`">
                        <span v-html="page.desc"></span>
                    </FeatureCard>
                </template>
                <FeatureCard v-for="page in Apps.pages" :title="(page as AppPage).appName"
                    :href="`${Apps.path}/${page.path}`">
                    <span v-html="page.desc"></span>
                </FeatureCard>
            </Grid>
        </Flex>
        <Footer />
    </Grid>
</template>