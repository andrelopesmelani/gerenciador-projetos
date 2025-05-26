<script setup lang="ts">
import type { Project } from '~/types/projects'
import { useDebounceFn } from '@vueuse/core'
import { highlightText } from '~/utils/utils'

const searchQuery = ref('')
const isSearchOpen = ref(false)
const searchHistory = ref<string[]>([])
const searchResults = ref<Project[]>([])
const { getProjects } = useProjects()

onMounted(() => {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
        searchHistory.value = JSON.parse(savedHistory)
    }
})


const performSearch = useDebounceFn(async () => {
    const term = searchQuery.value.trim().toLowerCase()

    if (term.length >= 3) {
        try {
            const { data } = await getProjects()
            const allProjects = Array.isArray(data.value) ? data.value : []
            searchResults.value = allProjects.filter(project =>
                project.projectName.toLowerCase().includes(term)
            )

            if (searchQuery.value && !searchHistory.value.includes(searchQuery.value)) {
                searchHistory.value.unshift(searchQuery.value)
                searchHistory.value = searchHistory.value.slice(0, 5)
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
            }
        } catch (error) {
            console.error('Erro na busca:', error)
            searchResults.value = []
        }
    } else {
        searchResults.value = []
    }
}, 500)


const redirectToSearchPage = () => {
    if (searchQuery.value.length >= 3) {
        navigateTo(`/projects/search?q=${encodeURIComponent(searchQuery.value)}`)
        isSearchOpen.value = false
    }
}

const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
}

const removeFromHistory = (query: string, event: Event) => {
    event.stopPropagation()
    searchHistory.value = searchHistory.value.filter(item => item !== query)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const selectFromHistory = (query: string) => {
    searchQuery.value = query
    performSearch()
}

const navigateToProject = (projectId: string) => {
    navigateTo(`/projects/${projectId}`)
    isSearchOpen.value = false
}
</script>

<template>
    <header class="header">
        <div class="logo-wrapper">
            <NuxtImg src="/images/logo.svg" alt="Logo" class="logo" />
        </div>

        <div class="search-container" :class="{ active: isSearchOpen }">
            <div class="search-input-wrapper">
                <input v-model="searchQuery" @input="performSearch" @focus="isSearchOpen = true"
                    @focusout="() => isSearchOpen = false" class="search-input" @keyup.enter="redirectToSearchPage" />
                <Icon v-if="searchQuery" name="ri:close-line" size="18" class="clear-icon" @click="clearSearch" />
                <Icon v-else name="ri:search-line" size="18" class="search-icon" @click="isSearchOpen = true" />
            </div>

            <div v-if="isSearchOpen" class="search-dropdown">
                <div v-if="searchHistory.length && !searchQuery" class="search-section">
                    <h4 class="section-title">Buscas recentes</h4>
                    <ul class="history-list">
                        <li v-for="(item, index) in searchHistory" :key="index" @click="selectFromHistory(item)"
                            @mousedown.prevent class="history-item">
                            <Icon name="ri:history-line" size="16" />
                            <span>{{ item }}</span>
                            <Icon name="ri:close-line" size="16" class="remove-history-icon"
                                @click.stop="removeFromHistory(item, $event)" />
                        </li>
                    </ul>
                </div>

                <div v-if="searchQuery && searchResults.length" class="search-section">
                    <h4 class="section-title">Projetos encontrados</h4>
                    <ul class="results-list">
                        <li v-for="project in searchResults" :key="project.id" class="result-item"
                            @click="navigateToProject(project.id)" @mousedown.prevent>
                            <div v-html="highlightText(project.projectName, searchQuery)" />
                            <div class="project-meta">
                                <span class="client">{{ project.client }}</span>
                                <span class="dates">
                                    {{ project.startDate }} - {{ project.endDate }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div v-if="searchQuery && !searchResults.length" class="search-section">
                    <p class="no-results">Nenhum projeto encontrado para "{{ searchQuery }}"</p>
                </div>
            </div>
        </div>
    </header>
</template>


<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

.header {
    position: relative;
    background-color: $primary-dark;
    padding: 0 48px;
    box-shadow: $shadow;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    border: 1px solid $black;
    gap: 20px;
}

.logo-wrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.logo {
    height: 50px;
}



.search-container {
    position: absolute;
    right: 36px;
    transition: all 0.3s ease;

    &.active {
        width: 20px;
        height: 60px;
        width: 100%;
        right: 0px;


        .search-input {
            background-color: $white;
            color: $text-dark;
            height: 60px;

            &::placeholder {
                color: $gray-light;
            }
        }
    }
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

@media (max-width: 769px) {
    .search-container {
      width: 10px;
    }

}

.search-input {
    width: 100%;
    padding: 8px 36px 8px 16px;
    border: none;
    background-color: $primary-dark;
    color: $white;
    font-size: 14px;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: rgba($white, 0.6);
    }
}

.search-icon,
.clear-icon {
    position: absolute;
    right: 12px;
    color: $white;
    cursor: pointer;
}

.clear-icon:hover {
    color: $error-main;
}

.search-dropdown {
    position: absolute;
    top: 99%;
    right: 0;
    width: 100%;
    overflow-y: auto;
    background-color: $white;
    z-index: 1000;
    border: 1px solid $purple-main;
    border-radius: 0px 0px 8px 8px;
    box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
}

.search-section {
    padding: 12px;
    border-bottom: 1px solid $gray-border-light;

    &:last-child {
        border-bottom: none;
    }
}

.section-title {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
    color: $gray-light;
    text-transform: uppercase;
}

.history-list,
.results-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.history-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    border-bottom: 1px solid $gray-border-light;
    position: relative;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: $gray-border-light;
    }

    span {
        @include text-md($gray-light);

    }

    svg {
        color: $gray-light;
    }
}

.result-item {
    padding: 12px;
    border-radius: 4px;
    border-bottom: 1px solid $gray-border-light;
    cursor: pointer;

    &:hover {
        background-color: $gray-border;
    }

    >div:first-child {
        font-weight: 500;
        margin-bottom: 4px;
    }

    &:last-child {
        border-bottom: none;
    }
}

.remove-history-icon {
    margin-left: auto;
    color: $gray-light;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
}

.project-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;

    .client {
        color: $text-dark;
    }

    .dates {
        color: $gray-light;
    }
}

.no-results {
    margin: 0;
    color: $gray-light;
    font-size: 14px;
}

.highlight {
    background-color: $accent;
    color: $accent;
    font-weight: bold;
    padding: 0 2px;
    border-radius: 2px;
}
</style>