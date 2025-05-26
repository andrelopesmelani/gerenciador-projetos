<template>
    <div class="input-file-container">
        <div v-if="existingImage && !previewImage && !imageRemoved" class="preview-container">
            <div class="preview-image-wrapper">
                <img :src="existingImage" alt="Imagem existente" class="preview-image" />
                <button type="button" class="remove-button" @click="removeExistingImage">
                    <Icon name="uil:trash" size="20" />
                </button>
            </div>
        </div>
        <div v-else-if="!previewImage" class="upload-area" @click="triggerFileInput">
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="file-input" />
            <div class="upload-content">
                <Icon name="ph:upload" size="24" class="upload-icon" />
                <p class="upload-subtitle">Escolha uma imagem .jpg ou .png no seu dispositivo</p>
                <ButtonOutlined title="Selecionar" :onClick="() => {}" />
            </div>
        </div>

        <div v-else class="preview-container">
            <div class="preview-image-wrapper">
                <img :src="previewImage" alt="Preview" class="preview-image" />
                <button type="button" class="remove-button" @click="removeImage">
                    <Icon name="uil:trash" size="20" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    existingImage: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['file-selected', 'existing-image-removed'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)
const imageRemoved = ref(false)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file && file.type.match('image.*')) {
        const reader = new FileReader()

        reader.onload = (e) => {
            previewImage.value = e.target?.result as string
            emit('file-selected', file)
        }

        reader.readAsDataURL(file)
    }
}

const removeImage = () => {
    previewImage.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    emit('file-removed')
}

const removeExistingImage = () => {
    emit('existing-image-removed')
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.input-file-container {
    width: 100%;
}

.file-input {
    display: none;
}

.upload-area {
    border: 1px dashed $gray-light;
    border-radius: 8px;
    padding: 18px 0px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: $purple-main;
    }
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .upload-icon {
        color: $gray-light;
    }
}

.upload-subtitle {
    @include text-md($gray-light);
}

.existing-image-container,
.preview-container {
    width: 100%;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
}

.preview-image-wrapper {
    position: relative;
    width: 100%;
}

.preview-image {
    display: block;
    width: 100%;
    height: auto;
    max-height: 300px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid $gray-border;
}

.remove-button {
    position: absolute;
    top: 10px;
    right: 20px;
    background-color: $white;
    box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: $purple-main;

    &:hover {
        background-color: $error-main;
        color: $white;
    }
}
</style>