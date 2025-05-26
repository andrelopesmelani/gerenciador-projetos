<template>
    <div class="loading-state">
        <span class="loader"></span>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    gap: 12px;
    height: 80vh;

    .loader {
        width: 40px;
        height: 40px;
        border: 4px solid $gray-border-light;
        border-top: 4px solid $purple-main;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
}
</style>