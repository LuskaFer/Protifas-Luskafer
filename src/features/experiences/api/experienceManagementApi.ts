import { api } from '@/shared/services/http'
import type { ExperienceDetail, ExperienceItem } from '../interfaces'

interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

function toFormData(data: Record<string, unknown>, file?: File | null, gallery?: File[]): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  }
  if (file) {
    formData.append('thumbnail', file)
  }
  if (gallery && gallery.length > 0) {
    for (const img of gallery) {
      formData.append('gallery', img)
    }
  }
  return formData
}

export const experienceManagementApi = {
  getList: async (page = 0, size = 50): Promise<PaginatedResponse<ExperienceItem>> => {
    const { data } = await api.get('/experiences', { params: { page, size } })
    return data
  },

  getById: async (id: string): Promise<ExperienceDetail> => {
    const { data } = await api.get(`/experiences/${id}`)
    return data
  },

  create: async (
    payload: Record<string, unknown>,
    file?: File | null,
    gallery?: File[],
  ): Promise<ExperienceDetail> => {
    const formData = toFormData(payload, file, gallery)
    const { data } = await api.post('/experiences', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  update: async (
    id: string,
    payload: Record<string, unknown>,
    file?: File | null,
    gallery?: File[],
  ): Promise<ExperienceDetail> => {
    const formData = toFormData(payload, file, gallery)
    const { data } = await api.put(`/experiences/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/experiences/${id}`)
  },

  publish: async (id: string): Promise<void> => {
    await api.patch(`/experiences/publish/${id}`)
  },

  archive: async (id: string): Promise<void> => {
    await api.patch(`/experiences/archive/${id}`)
  },

  toggleFeatured: async (id: string): Promise<void> => {
    await api.patch(`/experiences/featured/${id}`)
  },
}
