import type { User } from './user'
export interface ProductSize {
  weight: number
  length: number
  height: number
  width: number
}

export interface Product {
  title: string
  description: string
  price: number
  stock: number
  active: boolean
  sku: string
  size: ProductSize
  id?: string
  images?: ProductImage[]
  categoryIds?: number[]
  productCategories?: ProductCategory[]
  user?: User
}

export interface ProductImage {
  url: string
  key: string
  main: boolean
  order: number
  id?: string
}

export interface ProductCategory {
  id: number
  productId: number
  categoryId: number
  category: {
    id: number
    name: string
    idName: string
    level: number
    parentId: number | null
    parent?: {
      id: number
      name: string
      idName: string
      level: number
      parentId: number | null
      parent?: {
        id: number
        name: string
        idName: string
        level: number
        parentId: number | null
      }
    }
  }
}

