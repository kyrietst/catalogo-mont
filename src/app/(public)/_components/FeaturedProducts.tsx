'use client'

import { useEffect, useRef } from 'react'
import { ProductCard } from '@/components/catalog'
import { scrollReveal } from '@/lib/gsap/animations'
import type { Product } from '@/types/product'

interface FeaturedProductsProps {
    products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!gridRef.current) return

        const cards = Array.from(gridRef.current.querySelectorAll('.product-card')) as HTMLElement[]
        const ctx = scrollReveal(cards, { stagger: 0.15 })

        return () => ctx.revert()
    }, [products])

    if (products.length === 0) return null

    return (
        <section
            ref={sectionRef}
            className="py-20 md:py-32 bg-mont-cream"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-display text-4xl md:text-5xl text-mont-espresso mb-4">
                        Produtos em Destaque
                    </h2>
                    <p className="text-mont-gray text-lg max-w-2xl mx-auto">
                        Nossos produtos mais queridos, escolhidos a dedo pra você
                    </p>
                </div>

                {/* Layout Assimétrico: 1 grande + 2 pequenos */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className={`product-card ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                }`}
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                slug={product.slug}
                                category={product.category}
                                weight_kg={product.weight_kg}
                                price_cents={product.price_cents}
                                image_url={product.image_url}
                                is_featured={index === 0}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
