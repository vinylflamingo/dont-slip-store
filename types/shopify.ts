// Shopify Product Types
export interface ShopifyImage {
  url: string
  altText: string
}

export interface ShopifyImageEdge {
  node: ShopifyImage
}

export interface ShopifyMoneyV2 {
  amount: string
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoneyV2
}

export interface ShopifySelectedOption {
  name: string
  value: string
}

export interface ShopifyProductVariant {
  id: string
  title: string
  quantityAvailable: number
  availableForSale: boolean
  priceV2: ShopifyMoneyV2
  selectedOptions: ShopifySelectedOption[]
  image?: ShopifyImage
}

export interface ShopifyProductVariantEdge {
  node: ShopifyProductVariant
}

export interface ShopifyProductOption {
  id: string
  name: string
  values: string[]
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  descriptionHtml?: string
  totalInventory: number
  priceRange: ShopifyPriceRange
  images: {
    edges: ShopifyImageEdge[]
  }
  variants: {
    edges: ShopifyProductVariantEdge[]
  }
  options: ShopifyProductOption[]
  collections?: {
    edges: Array<{
      node: {
        products: {
          edges: ShopifyProductEdge[]
        }
      }
    }>
  }
}

export interface ShopifyProductNode {
  id: string
  title: string
  handle: string
  priceRange: ShopifyPriceRange
  images?: {
    edges: ShopifyImageEdge[]
  }
}

export interface ShopifyProductEdge {
  node: ShopifyProductNode
}

export interface ShopifyProductHandle {
  node: {
    id: string
    handle: string
  }
  cursor?: string
}

// Cart Item Interface
export interface CartItem {
  id: string
  title: string
  handle: string
  image: string
  options: { [key: string]: string }
  variantTitle: string
  variantPrice: number
  variantQuantity: number
}

// Variant Option Interface
export interface VariantOption extends CartItem {
  // Inherits all CartItem properties
}

// Checkout Interface
export interface Checkout {
  id: string
  webUrl: string
}

// Cart Line Item Interface
export interface CartLineItem {
  lineId: string
  merchandiseId: string
  quantity: number
}
