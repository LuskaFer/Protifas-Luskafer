export interface ItemObject {
  id: string
  title: string
  description: string
}

export interface Items {
  content: ItemObject[]
  page: number
  size: number
  elements: number
  totalElements: number
  totalPages: number
}
