export interface ExperienceItem {
  id: string
  title: string
  company: string
  period: string
  description: string
  thumbnail: string | null
  gallery: string[]
  createdAt?: string
}

export interface ExperienceDetail extends ExperienceItem {
  publishedDate?: string | null
  publicationStatus?: string
}

export const EXPERIENCE_STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Publicado',
  DRAFT: 'Rascunho',
  ARCHIVED: 'Arquivado',
}

export const EXPERIENCE_STATUS_VARIANT_MAP: Record<string, string> = {
  PUBLISHED: 'bg-green-500/10 text-green-600 border-green-500/20',
  DRAFT: 'bg-muted text-muted-foreground border-border',
  ARCHIVED: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
}
