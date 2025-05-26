import type { Ref } from "vue";
import type { FormErrors, FormProject } from "~/types/projects";

export const useFormValidation = (
  form: Ref<FormProject> | FormProject,
  errors: Ref<FormErrors> | FormErrors
) => {
  const getValue = <T>(source: Ref<T> | T): T => {
    return source && typeof source === "object" && "value" in source
      ? (source as Ref<T>).value
      : source;
  };

  const validateProjectName = (value: string): string => {
    if (!value.trim()) return "Nome do projeto é obrigatório";
    const words = value.trim().split(/\s+/);
    if (words.length < 2) return "Por favor, digite ao menos duas palavras";
    return "";
  };

  const validateClient = (value: string): string => {
    if (!value.trim()) return "Por favor, digite ao menos uma palavra";
    return "";
  };

  const validateDate = (dateString: string, fieldName: string): string => {
    if (!dateString) return `${fieldName} é obrigatória`;

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return "Selecione uma data válida";
    }

    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    const isValidDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    if (!isValidDate) return "Data inválida ou inexistente";
    return "";
  };

  const validateDateRange = (): void => {
    const currentForm = getValue(form);
    const currentErrors = getValue(errors);

    if (
      currentForm.startDate &&
      currentForm.endDate &&
      !currentErrors.startDate &&
      !currentErrors.endDate
    ) {
      const [startDay, startMonth, startYear] = currentForm.startDate
        .split("/")
        .map(Number);
      const [endDay, endMonth, endYear] = currentForm.endDate
        .split("/")
        .map(Number);

      const startDate = new Date(startYear, startMonth - 1, startDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);

      if (startDate > endDate) {
        if ("value" in errors) {
          errors.value.endDate =
            "Data final não pode ser anterior à data de início";
          errors.value.startDate =
            "Data de início não pode ser posterior à data final";
        } else {
          errors.endDate = "Data final não pode ser anterior à data de início";
          errors.startDate =
            "Data de início não pode ser posterior à data final";
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const currentForm = getValue(form);

    if ("value" in errors) {
      errors.value.projectName = validateProjectName(currentForm.projectName);
      errors.value.client = validateClient(currentForm.client);
      errors.value.startDate = validateDate(
        currentForm.startDate,
        "Data de início"
      );
      errors.value.endDate = validateDate(currentForm.endDate, "Data final");
    } else {
      errors.projectName = validateProjectName(currentForm.projectName);
      errors.client = validateClient(currentForm.client);
      errors.startDate = validateDate(currentForm.startDate, "Data de início");
      errors.endDate = validateDate(currentForm.endDate, "Data final");
    }

    validateDateRange();

    return !Object.values(getValue(errors)).some((error) => error !== "");
  };

  return {
    validateProjectName,
    validateClient,
    validateDate,
    validateDateRange,
    validateForm,
  };
};
