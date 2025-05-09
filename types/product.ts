export interface Product {
  title: string
  description: string
  price: number
  stock: number
  active: boolean
  id?: string
  images?: ProductImage[]
  categoryIds?: number[]
  productCategories?: ProductCategory[]
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

