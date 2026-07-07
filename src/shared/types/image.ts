export interface ImageObject {
  id: string
  url: string
}

export interface Images {
  content: ImageObject[]
  page: number
  size: number
  elements: number
  totalElements: number
  totalPages: number
}
