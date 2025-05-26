import { defineStore } from "pinia";
import type { Project } from "~/types/projects";

export const useFavoritesStore = defineStore("favorites", {
  persist: true,
  state: () => ({
    favorites: [] as Project[],
  }),

  actions: {
    toggleFavorite(project: Project) {
      const index = this.favorites.findIndex((fav) => fav.id === project.id);

      if (index >= 0) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(project);
      }
    },

    clearFavorites() {
      this.favorites = [];
    },
  },

  getters: {
    isFavorite: (state) => (projectId: string) => {
      return state.favorites.some((fav) => fav.id === projectId);
    },
    favoriteCount: (state) => state.favorites.length,
    getFavorites: (state) => state.favorites,
  },
});
