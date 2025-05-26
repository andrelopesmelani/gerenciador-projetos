<template>
    <div class="empty-state">
        <span>{{ title }}</span>
        <p>{{ subtitle }}</p>
        <ButtonDefault title="Novo projeto" icon="ei:plus" :onClick="onClick" />
    </div>
</template>

<script setup lang="ts">

defineProps<{
    onClick: () => void
    title: string
    subtitle: string
}>()
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 24px;
    padding: 2rem;
    background-color: $white;
    border-radius: 4px;
    height: 100%;

    span {
        @include heading-semibold($text-heading);
    }

    p {
        @include text-md($gray-light);
    }
}
</style>
