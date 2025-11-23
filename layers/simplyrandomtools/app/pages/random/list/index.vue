<script setup lang="ts">
import { getListIdsAsync } from '~/utils/random/listManager';
usePageInfo(RandomCategory.pages.find(x => x.path === 'list'))
const lists = await getListIdsAsync()
</script>
<template>
    <Feature category="snippets" tool="Quick Templates" kind="app" class="flex flex-col gap-4">
        <AppSaveWarning class="w-fit m-4" />
        <p class="text-center">Create your own list <OurLink href="/random/list/new">here</OurLink>, then you can use
            them with one of our randomizers!</p>
        <Flex column class="gap-2 grow m-4">
            <ClientOnly>
                <RandomListCard v-for="id in lists" :id :key="id" />
            </ClientOnly>
        </Flex>
        <template #summary>
            Manage your random lists.
        </template>
        <template #details>
            <p>This page allows you to manage your lists that you've created to use with SimplyRandomTools.
                You can view all your lists here, edit them, or create new ones. These lists can be used with various
                randomization tools available in the application to generate random selections based on your
                predefined data.</p>
        </template>
    </Feature>
</template>
<style scoped>
@reference '~~/layers/simplytools-ui/app/app.css';

.random-list-root {
    @apply grid mx-10 lg:mx-30 gap-4;
}
</style>