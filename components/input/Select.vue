<template>

    <div class="custom-select" :class="{
        'is-open': isOpen,
    }" @click="toggleDropdown" @blur="closeDropdown" tabindex="0">
        <div class="selected-value" :class="{
            'is-open': isOpen,
        }">
            <span v-if="selectedOption">
                {{ selectedOption.label }}
            </span>
            <span v-else class="placeholder">
                {{ placeholder }}
            </span>
            <Icon name="mingcute:down-line" size="24" class="dropdown-icon" :class="{ 'is-open': isOpen }" />
        </div>

        <Transition name="fade">
            <div v-show="isOpen" class="dropdown-options">
                <div v-for="option in options" :key="option.value" class="option" :class="{
                    'is-selected': isSelected(option.value),
                }" @mousedown="selectOption(option)">
                    <span>{{ option.label }}</span>
                </div>
            </div>
        </Transition>
    </div>

</template>

<script setup lang="ts">
import type { SelectOption } from '~/types/forms'

interface Props {
    modelValue?: string | number
    options: SelectOption[]
    label?: string
    placeholder?: string
    errorMessage?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedOption = computed(() =>
    props.options.find(opt => opt.value === props.modelValue)
)

const toggleDropdown = () => {
    isOpen.value = !isOpen.value

}

const closeDropdown = () => {
    isOpen.value = false
}

const selectOption = (option: SelectOption) => {
    emit('update:modelValue', option.value)
}

const isSelected = (value: string | number) => {
    return props.modelValue === value
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';


.custom-select {
    position: relative;
    border: 1px solid $gray-light;
    border-radius: 8px;
    background-color: $white;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    width: 300px;
    height: 40px;
    padding: 8px 16px;

    &.is-open {
        border: 1px solid $purple-main;
        border-radius: 8px 8px 0px 0px;
    }

    .selected-value {
        @include text-md($text-dark);
        display: flex;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;


        .placeholder {
            color: $gray-light;
        }
    }

    .dropdown-icon {
        transition: transform 0.2s ease;
        color: $gray-light;

        &.is-open {
            transform: rotate(180deg);
        }
    }

    .dropdown-options {
        position: absolute;
        top: calc(100%);
        left: -1px;
        width: 300px;
        overflow-y: auto;
        background-color: $white;
        border-radius: 0px 0px 8px 8px;
        box-shadow: $shadow;
        z-index: 100;
        border: 1px solid $purple-main;
    }

    .option {
        padding: 12px 16px;
        @include text-md($text-dark);
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background-color 0.2s ease;
        border-bottom: 1px solid $gray-border-light;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease, transform 0.2s ease;
        transform-origin: top;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        transform: scaleY(0.95);
    }


}
</style>