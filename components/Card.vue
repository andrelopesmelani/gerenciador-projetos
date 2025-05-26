<template>
    <div class="project-card">
        <div class="image-container">
            <img v-if="project.image" :src="project.image" :alt="project.projectName" class="project-image">
            <img v-else src="/public/images/empty.png" :alt="project.projectName" class="project-image">
            <div class="icon-overlay">
                <button :class="['favorite-button', { 'is-favorite': isFavorite }]" @click.stop="toggleFavorite"
                    aria-label="Alternar favorito">
                    <Icon :name="isFavorite ? 'material-symbols:star-rounded' : 'material-symbols:star-outline-rounded'"
                        size="26" />
                </button>
                <div class="menu-container">
                    <button class="icon-button" @click.stop="toggleMenu">
                        <Icon name="tabler:dots" size="20" />
                    </button>

                    <div v-if="isMenuOpen" class="dropdown-menu" ref="dropdownMenu">
                        <button class="menu-item" @click="handleEdit">
                            <Icon name="uil:edit" size="22" />
                            <span>Editar</span>
                        </button>
                        <button class="menu-item" @click="handleDelete">
                            <Icon name="uil:trash" size="22" />
                            <span>Remover</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="project-details">
            <h3>{{ project.projectName }}</h3>
            <div class="client-container">
                <span>Cliente: </span>
                <p>{{ project.client }}</p>
            </div>

            <div class="period-container">
                <div class="period">
                    <Icon name="ri:calendar-event-line" size="20" />
                    <span>{{ formatDate(project.startDate) }}</span>
                </div>
                <div class="period">
                    <Icon name="ri:calendar-check-line" size="20" />
                    <span>{{ formatDate(project.endDate) }}</span>
                </div>
            </div>
        </div>
    </div>

    <ModalConfirm v-if="showDeleteModal" :isOpen="showDeleteModal" title="Remover projeto"
        :projectName="project.projectName" message="Essa ação removerá definitivamente o projeto:"
        @confirm="confirmDelete" @close="cancelDelete" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Project } from '~/types/projects'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps<{
    project: Project
}>()

const showDeleteModal = ref(false)
const projectToDelete = ref<string | null>(null)

const emit = defineEmits(['edit', 'deleted'])

const { deleteProject } = useProjects()
const favoritesStore = useFavoritesStore()
const isFavorite = computed(() => favoritesStore.isFavorite(props.project.id))

const handleDelete = () => {
    projectToDelete.value = props.project.id
    showDeleteModal.value = true
    closeMenu()
}

const confirmDelete = async () => {
    if (!projectToDelete.value) return

    try {
        const success = await deleteProject(projectToDelete.value)
        if (success) {
            emit('deleted', projectToDelete.value)
        }
    } finally {
        showDeleteModal.value = false
        projectToDelete.value = null
    }
}

const cancelDelete = () => {
    showDeleteModal.value = false
    projectToDelete.value = null
}

const toggleFavorite = () => {
    favoritesStore.toggleFavorite(props.project)
}

const isMenuOpen = ref(false)
const dropdownMenu = ref<HTMLElement | null>(null)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const handleEdit = () => {
    navigateTo(`/projects/${props.project.id}`)
    emit('edit', props.project.id)
    closeMenu()
}

const closeMenu = () => {
    isMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownMenu.value && !dropdownMenu.value.contains(event.target as Node)) {
        closeMenu()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.project-card {
    border-radius: 16px;
    background-color: $white;

    cursor: pointer;

    .image-container {
        position: relative;
        width: 100%;
        height: 232px;

    }

    .project-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        border-radius: 16px 16px 0px 0px;
    }

    .icon-overlay {
        position: absolute;
        bottom: 12px;
        right: 12px;
        display: flex;
        gap: 8px;
    }

    .favorite-button {
        background-color: transparent;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: $white;
        filter: drop-shadow($shadow);
        transition: all 0.3s;

        &.is-favorite {
            color: $accent;
            animation: pulse 0.5s;
        }

        &:hover {
            scale: 1.2;
        }
    }

    .menu-container {
        position: relative;
        display: inline-block;
    }

    .dropdown-menu {
        position: absolute;
        right: 0;
        top: 40px;
        background-color: $white;
        border-radius: 8px;
        box-shadow: $shadow;
        width: 160px;
        z-index: 100;
        overflow: hidden;
        border: 1px solid $gray-border-light;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 8px 12px;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        color: $purple-main;

        span {
            @include text-md($purple-main);
            margin-top: 2px;
        }

        &:hover {
            background-color: $gray-border-light;
        }

    }

    .icon-button {
        position: relative;
        background-color: $white;
        border: 1px solid $gray-border;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: $purple-main;
        box-shadow: $shadow;
        transition: all .3s;

        &:hover {
            color: $white;
            background-color: $purple-main;
            border-color: $purple-main;
        }
    }



    .project-details {
        padding: 18px;
        background-color: $white;
        border-radius: 0px 0px 16px 16px;
        border: 1px solid $gray-border-light;


        .period-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            border-top: 1px solid $gray-border-light;
            padding-top: 12px;

            .period {
                display: flex;
                align-items: center;
                gap: 12px;
                color: $gray-light;


                span {
                    @include text-md($gray-light)
                }
            }
        }

        h3 {
            @include heading-bold($text-heading)
        }

        .client-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 12px 0px;

            span {
                @include text-md-bold($gray-light)
            }

            p {
                @include text-md($gray-light)
            }
        }
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>