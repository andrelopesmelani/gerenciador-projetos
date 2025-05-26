<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'
import type { Project } from '~/types/projects'

const selectedFilter = ref('1')
const showOnlyFavorites = ref(false)

const filterOptions = [
    { value: '1', label: 'Ordem alfabética' },
    { value: '2', label: 'Mais recentes' },
    { value: '3', label: 'Próximos do fim' }
]

const { getProjects } = useProjects()
const favoritesStore = useFavoritesStore()

const { data: projectsData, pending } = useAsyncData('projects', async () => {
    try {
        const { data } = await getProjects()
        return data.value || []
    } catch (error) {
        console.error('Erro ao carregar projetos:', error)
        return []
    }
})

const projects = computed(() => projectsData.value || [])

const filteredProjects = computed(() => {
    if (!showOnlyFavorites.value) return projects.value
    return projects.value.filter(project => favoritesStore.isFavorite(project.id))
})

const sortedAndFilteredProjects = computed(() => {
    const filtered = filteredProjects.value.slice()

    const parseBrDate = (dateString: string) => {
        const [day, month, year] = dateString.split('/')
        return new Date(`${month}/${day}/${year}`)
    }

    switch (selectedFilter.value) {
        case '1':
            return filtered.sort((a, b) =>
                a.projectName.localeCompare(b.projectName))

        case '2':
            return filtered.sort((a, b) =>
                parseBrDate(a.startDate).getTime() - parseBrDate(b.startDate).getTime()
            )

        case '3':
            return filtered.sort((a, b) =>
                parseBrDate(a.endDate).getTime() - parseBrDate(b.endDate).getTime()
            )

        default:
            return filtered
    }
})

const handleProjectDeleted = (deletedId: string) => {
    projectsData.value = projectsData.value?.filter(p => p.id !== deletedId) || []

    if (favoritesStore.isFavorite(deletedId)) {
        favoritesStore.toggleFavorite({ id: deletedId } as Project)
    }
}
</script>

<template>
    <Suspense>
        <template #default>
            <EmptyState v-if="!pending && projects.length === 0" title="Nenhum projeto"
                subtitle="Clique no botão abaixo para criar o primeiro e gerenciá-lo."
                :onClick="() => navigateTo('projects/create')" />

            <div v-else class="projects-container">
                <TitlePage :title="`Projetos (${filteredProjects.length})`" :backButton="false">
                    <template #buttons>
                        <div class="actions-container">
                            <label class="toggle-favorites">
                                <input type="checkbox" v-model="showOnlyFavorites" />
                                <span class="slider"></span>
                                <span class="label-text">Apenas favoritos</span>
                            </label>

                            <InputSelect v-model="selectedFilter" :options="filterOptions" placeholder="Ordenar por" />

                            <ButtonDefault title="Novo projeto" icon="ei:plus"
                                :onClick="() => navigateTo('/projects/create')" />
                        </div>
                    </template>
                </TitlePage>
                <div class="projects-grid">
                    <Card v-for="project in sortedAndFilteredProjects" :key="project.id" :project="project"
                        @deleted="handleProjectDeleted" />
                </div>
            </div>
        </template>

        <template #fallback>
            <Loading />
        </template>
    </Suspense>
</template>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.projects-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.filter-controls {
    padding: 20px 20px 0;
    display: flex;
    justify-content: flex-end;
}

.actions-container {
    display: flex;
    align-items: center;
    gap: 24px;

    .toggle-favorites {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;

        input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            background-color: $gray-light;
            border-radius: 24px;
            transition: .4s;

            &:before {
                content: "";
                position: absolute;
                height: 12px;
                width: 12px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                border-radius: 50%;
                transition: .4s;
            }
        }

        input:checked+.slider {
            background-color: $accent;
        }

        input:checked+.slider:before {
            transform: translateX(20px);
        }

        .label-text {
            @include text-md($text-dark)
        }
    }
}

@media (max-width: 769px) {
    .actions-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 18px;
    }

}


.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}
</style>