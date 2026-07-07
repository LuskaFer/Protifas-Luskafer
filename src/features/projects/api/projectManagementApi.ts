import { api } from '@/shared/services/http'
import type { ProjectDetail, ProjectItem } from '../interfaces'

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

export const projectManagementApi = {
  getList: async (page = 0, size = 50): Promise<PaginatedResponse<ProjectItem>> => {
    const { data } = await api.get('/projects', { params: { page, size } })
    return data
  },

  getById: async (id: string): Promise<ProjectDetail> => {
    const { data } = await api.get(`/projects/${id}`)
    return data
  },

  create: async (
    payload: Record<string, unknown>,
    file?: File | null,
    gallery?: File[],
  ): Promise<ProjectDetail> => {
    const formData = toFormData(payload, file, gallery)
    const { data } = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  update: async (
    id: string,
    payload: Record<string, unknown>,
    file?: File | null,
    gallery?: File[],
  ): Promise<ProjectDetail> => {
    const formData = toFormData(payload, file, gallery)
    const { data } = await api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },

  publish: async (id: string): Promise<void> => {
    await api.patch(`/projects/publish/${id}`)
  },

  archive: async (id: string): Promise<void> => {
    await api.patch(`/projects/archive/${id}`)
  },
}
