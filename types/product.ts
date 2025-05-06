export interface Product {
  title: string
  description: string
  price: number
  stock: number
  active: boolean
  id?: string
  images?: ProductImage[]
}

export interface ProductImage {
  url: string
  key: string
  main: boolean
  order: number
  id?: string
}

