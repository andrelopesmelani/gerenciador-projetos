<template>
    <button :style="{ width, height }" type="button" :disabled="disabled" @click="!disabled && emit('click')" class="app-button"
        :class="{ disabled }">
        <span>{{ title }}</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    onClick: () => void
    title: string
    disabled?: boolean
    width?: string
    height?: string
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

.app-button {
    height: 32px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background-color: $white;
    border: 1px solid $purple-main;
    padding: 0 20px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background-color: $purple-main;

        span {
            @include text-md($white);
        }
    }

    span {
        @include text-md($purple-main);
    }

    &.disabled {
        background-color: lighten($purple-main, 20%);
    }
}
</style>