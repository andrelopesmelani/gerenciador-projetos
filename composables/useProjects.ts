import type { FormProject, Project } from "~/types/projects";

export const useProjects = () => {
  const baseUrl = "http://localhost:3001/projects";

  const getProjects = async () => {
    return await useFetch(baseUrl, {
      method: "GET",
    });
  };

  const createProject = async (projectData: Project) => {
    const { data, error } = await useFetch(baseUrl, {
      method: "POST",
      body: projectData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { data, error };
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await useFetch(`${baseUrl}/${projectId}`, {
        method: "DELETE",
      });

      if (error.value) {
        throw error.value;
      }

      return true;
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      return false;
    }
  };

const fetchProjectById = async (id: string) => {
    const { data, error } = await useFetch<Project>(`${baseUrl}/${id}`, {
        method: "GET",
    })

    if (error.value) {
        throw new Error(error.value.message)
    }

    return { data: data as Ref<Project | null>, error }
}

  const updateProject = async (
    id: string,
    projectData: Partial<FormProject>
  ) => {
    try {
      const { data, error } = await useFetch<Project>(`${baseUrl}/${id}`, {
        method: "PUT",
        body: projectData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (error.value) {
        throw error.value;
      }

      return { data, error };
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      return { data: null, error };
    }
  };

  return {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
    fetchProjectById
  };
};
