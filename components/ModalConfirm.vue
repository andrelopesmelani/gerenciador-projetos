<template>
    <Transition name="fade">
        <div v-if="isOpen" class="modal-overlay" @click.self="close">
            <div class="modal-container">
                <div class="icon-container">
                    <Icon name="uil:trash" size="16" />
                </div>
                <div class="modal-header">
                    <h3>{{ title }}</h3>
                </div>

                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>

                <div class="project-name">
                    <p>{{ projectName }}</p>
                </div>

                <div class="modal-footer">
                    <ButtonOutlined title="Cancelar" :onClick="close" width="100%" height="40px" />
                    <ButtonDefault title="Confirmar" :onClick="confirm" width="100%" />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: 'Confirmar exclusão'
    },
    message: {
        type: String,
        default: 'Tem certeza que deseja remover este projeto?'
    },
    projectName: {
        type: String,
        default: "Nome do projeto"
    }
})

const emit = defineEmits(['confirm', 'close'])

const close = () => {
    emit('close')
}

const confirm = () => {
    emit('confirm')
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: $white;
    border-radius: 8px;
    width: 100%;
    max-width: 450px;
    box-shadow: $shadow;
    overflow: visible;
    padding: 28px;

    .icon-container {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background-color: $purple-main;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
        color: $white;
        border-radius: 24px;
        right: calc(50% - 24px);
        top: -24px;
        z-index: 200;
    }
}

.modal-header {
    text-align: center;
    padding: 16px 0px  24px 0px;
    border-bottom: 1px solid #8C8B93;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    h3 {
        @include heading-sx-bold($text-heading);
        margin: 0;
    }
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: $gray-light;
    padding: 4px;

    &:hover {
        color: $text-dark;
    }
}

.modal-body {
    padding: 24px 0px 20px 0px;

    p {
        @include text-md($gray-light);
        margin: 0;
    }
}

.project-name {
        padding-bottom: 32px;
    p {
        @include heading-semibold($text-dark);
    }
}

.modal-footer {
    display: flex;
    align-items: center;
    gap: 24px;
    width: 100%;
}

.cancel-button {
    @include text-md($error-main);
    padding: 8px 16px;
}

.confirm-button {
    @include text-md($error-main);
    padding: 8px 16px;
    background-color: $error-main;

    &:hover {
        background-color: darken($error-main, 10%);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>