export interface PreferenceObject {
  key: string
  value: string
}

export interface Preferences {
  content: PreferenceObject[]
  page: number
  size: number
  elements: number
  totalElements: number
  totalPages: number
}
