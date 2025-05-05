export interface Product {
  title: string
  description: string
  price: number
  stock: number
  active: boolean
  images?: {
    url: string
    key: string
    main: boolean
    order: number
  }[]
}
