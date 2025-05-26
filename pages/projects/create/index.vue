<script setup lang="ts">
import type { FormErrors, FormProject } from '~/types/projects'
import { convertFileToBase64 } from '~/utils/utils'

const { createProject } = useProjects()
const router = useRouter()

const fileInputKey = ref(0)

const form = reactive<FormProject>({
    projectName: '',
    client: '',
    startDate: '',
    endDate: '',
    image: null as File | null
})

const errors = reactive<FormErrors>({
    projectName: '',
    client: '',
    startDate: '',
    endDate: '',
})
const { validateProjectName, validateClient, validateDate, validateForm, validateDateRange } = useFormValidation(form, errors)

const handleFileSelected = (file: File) => {
    form.image = file
}

const handleFileRemoved = () => {
    form.image = null
}


const handleSubmit = async () => {
    if (!validateForm()) return

    try {
        const projectData = {
            projectName: form.projectName,
            client: form.client,
            startDate: form.startDate,
            endDate: form.endDate,
            image: form.image ? await convertFileToBase64(form.image) : null
        }
        const { data, error } = await createProject(projectData)

        if (error.value) {
            throw new Error(error.value.message)
        }

        resetForm()
        router.push('/')

    } catch (error) {
        console.error(error)
    }
}

const resetForm = () => {
    form.projectName = ''
    form.client = ''
    form.startDate = ''
    form.endDate = ''
    form.image = null

    fileInputKey.value++

    const errorKeys = Object.keys(errors) as Array<keyof FormErrors>
    errorKeys.forEach(key => {
        errors[key] = ''
    })
}
</script>

<template>
    <TitlePage title="Novo projeto" backButton />
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
            <InputFile button-text="Escolher arquivo" @file-selected="handleFileSelected"
                @file-removed="handleFileRemoved" :key="fileInputKey" />

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