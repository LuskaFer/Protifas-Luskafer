export interface ProjectItem {
  id: string
  title: string
  dateMade: string
  repositoryUrl: string | null
  liveUrl: string | null
  description: string
  company: string | null
  thumbnail: string | null
  gallery: string[]
  projectType: 'DEV' | 'GENERAL'
  createdAt?: string
}

export interface ProjectDetail extends ProjectItem {
  publishedDate?: string | null
  publicationStatus?: string
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Publicado',
  DRAFT: 'Rascunho',
  ARCHIVED: 'Arquivado',
}

export const PROJECT_STATUS_VARIANT_MAP: Record<string, string> = {
  PUBLISHED: 'bg-green-500/10 text-green-600 border-green-500/20',
  DRAFT: 'bg-muted text-muted-foreground border-border',
  ARCHIVED: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
}
