<script setup lang="ts">
import { RandomCategory } from '~/utils/pages/random';
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
            Quickly find and use code templates for your projects, or create your own custom snippets.
        </template>
        <template #details>
            <p>
                The Quick Templates feature lets you browse built-in code snippets or add your own reusable templates.
                Streamline your workflow by copying and customizing snippets for any use case.
                All templates are managed in one place for easy access and editing.
            </p>
            <p>
                Built-in snippets cover common patterns and best practices, while custom snippets allow you to tailor
                solutions to your needs.
                Perfect for developers who want to save time and avoid repetitive coding tasks.
            </p>
        </template>
    </Feature>
</template>
<style scoped>
@reference '~~/layers/theme/app/app.css';

.random-list-root {
    @apply grid mx-10 lg:mx-30 gap-4;
}
</style>