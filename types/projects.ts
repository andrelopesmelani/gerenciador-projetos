export interface Project {
    id: string
    projectName: string
    client: string
    startDate: string
    endDate: string
    image?: string
}

export interface FormProject {
  projectName: string
  client: string
  startDate: string
  endDate: string
  image: File | null
    existingImage?: string | null 
}

export interface FormErrors {
  projectName: string
  client: string
  startDate: string
  endDate: string
}