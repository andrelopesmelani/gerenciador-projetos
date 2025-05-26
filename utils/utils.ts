export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split("/");
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const monthIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${monthNames[monthIndex]} de ${year}`;
}

export const highlightText = (text: string ,searchQuery: any) => {
    if (!searchQuery.value) return text
    const regex = new RegExp(`(${escapeRegExp(searchQuery.value)})`, 'gi')
    return text.replace(regex, '<span class="highlight">$1</span>')
}

export const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
