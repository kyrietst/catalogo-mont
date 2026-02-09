export interface Product {
    id: string
    name: string
    slug: string
    description: string | null
    category: 'congelado' | 'refrigerado'
    weight_kg: number
    price_cents: number
    cost_cents: number | null
    stock_quantity: number
    stock_min_alert: number
    is_active: boolean
    is_featured: boolean
    sort_order: number
    created_at: string
    updated_at: string
    image_url?: string | null // Deprecated: use primary_image_url
    primary_image_url: string | null
    images: any[] | null
    stock_status: string
}

export interface ProductImage {
    id: string
    product_id: string
    url: string
    alt_text: string | null
    sort_order: number
    is_primary: boolean
    created_at: string
}

export interface ProductWithImages extends Product {
    images: ProductImage[]
}
