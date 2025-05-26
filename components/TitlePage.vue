<template>
    <div class="title-container">
        <div class="back-button-container" v-if="backButton" :onclick="() => navigateTo('/')">
            <Icon name="mingcute:arrow-left-fill" size="14" />
            <span>Voltar</span>
        </div>
        <div class="title-text">
            <h1>{{ title }}</h1>
            <slot name="buttons" />
        </div>

    </div>
</template>

<script setup lang="ts">
defineProps<{
    backButton: boolean
    title: string
}>()
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

.title-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;

    .back-button-container {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: $purple-main;

        span {
            @include text-md($purple-main);
        }

        &:hover {
            span {
                color: darken($purple-main, 10)
            }

            color: darken($purple-main, 10)
        }
    }

    .title-text {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h1 {
            @include heading-semibold($text-heading);
        }
    }

    @media (max-width: 769px) {
        .title-text {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
        }

    }
}
</style>
