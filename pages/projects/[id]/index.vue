<script setup lang="ts">
import type { FormErrors, FormProject } from '~/types/projects'
import { convertFileToBase64 } from '~/utils/utils'

const { updateProject, fetchProjectById } = useProjects()
const route = useRoute()
const router = useRouter()

const projectId = route.params.id as string
const fileInputKey = ref(0)

const form = reactive<FormProject>({
    projectName: '',
    client: '',
    startDate: '',
    endDate: '',
    image: null as File | null,
    existingImage: null
})

const errors = reactive<FormErrors>({
    projectName: '',
    client: '',
    startDate: '',
    endDate: '',
})

const { validateProjectName, validateClient, validateDate, validateForm, validateDateRange } = useFormValidation(form, errors)

onMounted(async () => {
    try {
        const { data } = await fetchProjectById(projectId)

        if (data.value) {
            form.projectName = data.value.projectName
            form.client = data.value.client
            form.startDate = data.value.startDate
            form.endDate = data.value.endDate
            form.existingImage = data.value.image || null
        } else {
            console.error('Dados do projeto não encontrados')
            router.push('/')
        }
    } catch (error) {
        console.error('Erro ao carregar projeto:', error)
        router.push('/')
    }
})

const handleFileSelected = (file: File) => {
    form.image = file
    form.existingImage = ''
}

const handleFileRemoved = () => {
    form.image = null
}

const handleExistingImageRemoved = () => {
    form.existingImage = ''
    form.image = null
}

const handleSubmit = async () => {
    if (!validateForm()) return

    try {
        let imageToSend = null

        if (form.image) {
            imageToSend = await convertFileToBase64(form.image)
        } else if (form.existingImage) {
            imageToSend = form.existingImage
        }
        const projectData = {
            projectName: form.projectName,
            client: form.client,
            startDate: form.startDate,
            endDate: form.endDate,
            image: imageToSend
        }

        const { error } = await updateProject(projectId, projectData)

        if (error.value) {
            throw new Error(error.value.message)
        }

        router.push('/')

    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <TitlePage title="Editar projeto" backButton />
    <div class="content">
        <form>
            <InputText label="Nome do projeto" v-model="form.projectName" required :errorMessage="errors.projectName"
                @blur="errors.projectName = validateProjectName(form.projectName)" />
            <InputText label="Cliente" v-model="form.client" required :errorMessage="errors.client"
                @blur="errors.client = validateClient(form.client)" />
            <div class="date-container">
                <InputText type="date-type" label="Data de início" v-model="form.startDate" required
                    :errorMessage="errors.startDate" icon="ri:calendar-event-line"
                    @blur="errors.startDate = validateDate(form.startDate, 'Data de início'); validateDateRange()" />
                <InputText type="date-type" label="Data Final" v-model="form.endDate" required
                    :errorMessage="errors.endDate" icon="ri:calendar-check-line"
                    @blur="errors.endDate = validateDate(form.endDate, 'Data final'); validateDateRange()" />
            </div>
            <InputFile button-text="Alterar arquivo" @file-selected="handleFileSelected"
                @file-removed="handleFileRemoved" @existing-image-removed="handleExistingImageRemoved"
                :key="fileInputKey" :existing-image="form.existingImage" />

            <ButtonDefault :onClick="handleSubmit" title="Salvar Projeto"
                :disabled="!form.projectName || !form.client || !form.startDate || !form.endDate" />
        </form>
    </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

.content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 24px;
    padding: 24px 16px;
    border: 1px solid $gray-border;
    border-radius: 4px;
    margin: 0 16px;

    form {
        width: 100%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .date-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;

            @media (min-width: 768px) {
                flex-direction: row;
                gap: 24px;
            }
        }
    }

    @media (min-width: 768px) {
        padding: 36px 24px;
        margin: 0 24px;
    }

    @media (min-width: 1024px) {
        form {
            width: 35%;
        }
    }
}

@media (max-width: 767px) {

    :deep(.input-text),
    :deep(.input-file),
    :deep(.button-default) {
        width: 100%;
    }

    :deep(.date-type) {
        width: 100%;
    }
}
</style>