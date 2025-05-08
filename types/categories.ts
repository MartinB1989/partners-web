export interface Category {
  id?: number
  level: 1 | 2 | 3
  name: string
  parentId?: 1 | 2 | null
}

