<script setup lang="ts">
const props = defineProps<{
    label: string
    placeholder?: string
    required?: boolean
    errorMessage?: string
    modelValue: string
    type?: string
    icon?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const inputType = computed(() => props.type ?? 'text')
const hasError = computed(() => !!props.errorMessage)

const formatDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const day = cleaned.substring(0, 2)
    const month = cleaned.substring(2, 4)
    const year = cleaned.substring(4, 8)

    let formatted = day
    if (month) formatted += `/${month}`
    if (year) formatted += `/${year}`

    return formatted
}

const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value = target.value

    if (props.type === 'date-type') {
        value = formatDate(value)
        target.value = value
    }

    emit('update:modelValue', value)
}
</script>


<template>
    <div class="input-wrapper">
        <label :class="{ 'error': hasError }">
            {{ label }} <span v-if="required" :class="{ 'error': hasError }">(Obrigatório)</span>
        </label>

        <div class="input-icon-wrapper">
            <input :type="inputType" :value="modelValue" :placeholder="placeholder"
                :class="{ 'error': hasError, 'has-icon': !!icon }" @input="updateValue"
                :maxlength="inputType === 'date' ? 10 : undefined" />

            <Icon v-if="icon" :name="icon" class="input-icon" :class="{ 'error': hasError }" />
        </div>

        <p v-if="hasError" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<style scoped lang="scss">
@import '@@/assets/scss/variables.scss';

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;

    label {
        @include text-md-semibold($purple-main);

        &.error {
            @include text-md-semibold($error-dark);
        }

        span {
            @include text-sx($gray-light);

            &.error {
                color: $error-main;
            }
        }
    }

    .input-icon-wrapper {
        position: relative;
        width: 100%;
    }

    input {
        @include text-md($text);
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid $gray-light;
        outline: 0;
        width: 100%;

        &.has-icon {
            padding-right: 2.5rem;
        }

        &.error {
            border-color: $error-main;
        }

        &:focus {
            border-color: $purple-main;
        }
    }

    .input-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: $gray-light;
        pointer-events: none;
        font-size: 1.2rem;

        &.error {
            color: $error-main;
        }
    }

    .error-message {
        @include text-sx($error-main);

    }
}
</style>
