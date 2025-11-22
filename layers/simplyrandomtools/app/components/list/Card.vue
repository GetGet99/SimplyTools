<script setup lang="ts">
import { getListNameAsync, deleteListAsync } from '~/utils/random/listManager';
const props = defineProps<{ id: UUID }>()
const name = await getListNameAsync(props.id)
const isDeleted = ref(false)
</script>
<template>
    <OurLink :href='`/random/list/${id}`'
        class="manual group p-4 border control-border-control active:control-border-control-pressed bg-card rounded-2"
        :class="isDeleted ? 'hidden' : ''">
        <Flex class="gap-2 items-start">
            <h3 class="text-card-title">{{ name }}</h3>
            <Grow />
            <LinkButton icon="left" class="manual flex gap-1 pl-2" :href="`/random/list/${id}/spinner`">
                <RandomSpinnerIcon />
                Spinner
            </LinkButton>
            <LinkButton icon="left" :href="`/random/list/${id}/wheel`">
                <RandomWheelIcon />
                Wheel
            </LinkButton>
            <LinkButton icon="left" :href="`/random/list/${id}/card`">
                <RandomCardIcon />
                Card
            </LinkButton>
            <Control>
                <OurLink class="manual flex gap-1 pl-2" :href="`/random/list/${id}/edit`">
                    <IconEdit alt="" />
                    Edit
                </OurLink>
            </Control>
            <ContentDialog>
                <template #trigger>
                    <DialogTrigger as-child>
                        <Button class="p-button-icon" title="Delete" @click.stop.prevent>
                            <IconDelete alt="Close" />
                        </Button>
                    </DialogTrigger>
                </template>
                <template #title>
                    Are you sure you want to delete "{{ name }}"?
                </template>
                <span>Deleting "{{ name }}" (<code class="inline">{{ id }}</code>) will cause its
                    content to be lost forever. This will not be recoverable unless you have your own backup.</span>
                <template #footer>
                    <DialogClose as-child>
                        <Button class="text-danger" @click="() => {
                            deleteListAsync(id)
                            isDeleted = true
                            if (useRequestURL().searchParams.get('view') === id) {
                                navigateTo('/snippets', { replace: true })
                            }
                        }">Confirm Delete</Button>
                    </DialogClose>
                </template>
            </ContentDialog>
        </Flex>
    </OurLink>
</template>