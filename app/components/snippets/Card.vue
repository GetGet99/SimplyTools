<script setup lang="ts">
import Delete from '@fluentui/svg-icons/icons/delete_24_regular.svg?raw'
import { deleteSnippetAsync, getMetadataAsync, getSnippetAsync } from '~/utils/snippets/manager';
const props = defineProps<{ snippetKey: string }>()
const meta = await getMetadataAsync(props.snippetKey)
const isDeleted = ref(false)
</script>
<template>
    <OurLink :href='`/snippets/${snippetKey}`'
        class="manual group p-4 border control-border-control active:control-border-control-pressed bg-card rounded-2"
        :class="isDeleted ? 'hidden' : ''">
        <Grid rows="auto grow auto" class="gap-3 h-full">
            <Flex class="gap-1 items-start">
                <h3 class="text-card-title">{{ meta?.name }} {{ meta?.lang ? `(${meta?.lang})` : '' }}</h3>
                <Grow />
                <ContentDialog v-if="snippetKey.startsWith('local.')">
                    <template #trigger>
                        <DialogTrigger as-child>
                            <Button class="p-button-icon" title="Delete" @click.stop.prevent>
                                <Icon :icon="Delete" alt="" />
                            </Button>
                        </DialogTrigger>
                    </template>
                    <template #title>
                        Are you sure you want to delete "{{ meta?.name }}"?
                    </template>
                    <span>Deleting "{{ meta?.name }}" (<code class="inline">{{ snippetKey }}</code>) will cause its
                        content to be lost
                        forever.
                        This will not be recoverable unless you have your own backup.</span>
                    <template #footer>
                        <DialogClose as-child>
                            <Button class="text-danger" @click="() => {
                                deleteSnippetAsync(snippetKey)
                                isDeleted = true
                                if (useRequestURL().searchParams.get('view') === snippetKey) {
                                    navigateTo('/snippets', { replace: true })
                                }
                            }">Confirm Delete</Button>
                        </DialogClose>
                    </template>
                </ContentDialog>
            </Flex>
            <p class="card-text min-h-20">
                {{ meta?.description }}
            </p>
            <Flex aria-hidden>
                <Control aria-hidden variant="none"
                    class="p-button rounded-control bg-control-primary group-hover:bg-control-secondary group-active:bg-control-tertiary control-border-control group-active:control-border-control-pressed">
                    <div>Use</div>
                </Control>
            </Flex>
        </Grid>
    </OurLink>
</template>