<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import type { Project } from '~/types/projects'
import { useProjects } from '~/composables/useProjects'

const route = useRoute()
const searchTerm = ref('')
const projects = ref<Project[]>([])
const isLoading = ref(false)

const { getProjects } = useProjects()

const fetchProjects = async (term: string) => {
    if (!term || term.length < 3) {
        projects.value = []
        return
    }

    isLoading.value = true
    try {
        const { data } = await getProjects()
        const allProjects = Array.isArray(data.value) ? data.value : []
        projects.value = allProjects.filter(p =>
            p.projectName.toLowerCase().includes(term.toLowerCase())
        )
    } catch (err) {
        console.error('Erro ao buscar projetos:', err)
        projects.value = []
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    const q = route.query.q?.toString() || ''
    searchTerm.value = q
    fetchProjects(q)
})

watch(() => route.query.q, (newQ) => {
    const term = newQ?.toString() || ''
    searchTerm.value = term
    fetchProjects(term)
})

const handleProjectDeleted = (deletedId: string) => {
    projects.value = projects.value?.filter(p => p.id !== deletedId) || []
}
</script>

<template>
    <div class="projects-container">
        <TitlePage title="Resultado da busca" backButton />
        <div v-if="projects.length === 0" class="no-results">
            Nenhum projeto encontrado.
        </div>
        <div v-else class="projects-grid">
            <Card v-for="project in projects" :key="project.id" :project="project" @deleted="handleProjectDeleted" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.projects-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.no-results {
    font-size: 16px;
    color: #888;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}
</style>
