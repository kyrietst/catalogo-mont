'use client'

import { ProductCard } from '@/components/catalog'
import type { Product } from '@/types/product'

interface RelatedProductsProps {
    products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    return (
        <section>
            <h2 className="font-display text-3xl text-mont-espresso mb-8">
                Você também pode gostar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        slug={product.slug}
                        category={product.category}
                        weight_kg={product.weight_kg}
                        price_cents={product.price_cents}
                        anchor_price_cents={product.anchor_price_cents}
                        image_url={product.primary_image_url || product.image_url}
                    />
                ))}
            </div>
        </section>
    )
}
