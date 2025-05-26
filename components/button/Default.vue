<template>
    <button :style="{ width, height }" type="button" :disabled="disabled" @click="!disabled && emit('click')"
        class="app-button" :class="{ disabled }">
        <Icon v-if="icon" :name="icon" size="26" />
        <span>{{ title }}</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    onClick: () => void
    title: string
    icon?: string
    width?: string
    height?: string
    disabled?: boolean
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

.app-button {
    height: 40px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background-color: $purple-main;
    border: none;
    padding: 0 20px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background-color: darken($purple-main, 10%);
    }

    span {
        @include heading-sx($white);
    }

    &.disabled {
        background-color: lighten($purple-main, 20%);
    }
}
</style>