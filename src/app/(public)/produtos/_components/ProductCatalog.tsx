'use client'

import { useState, useEffect, useRef } from 'react'
import { ProductCard } from '@/components/catalog'
import { scrollReveal } from '@/lib/gsap/animations'
import type { Product } from '@/types/product'

interface ProductCatalogProps {
    products: Product[]
}

type Category = 'todos' | 'congelado' | 'refrigerado'

export default function ProductCatalog({ products }: ProductCatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category>('todos')
    const gridRef = useRef<HTMLDivElement>(null)

    const filteredProducts = selectedCategory === 'todos'
        ? products
        : products.filter(p => p.category === selectedCategory)

    useEffect(() => {
        if (!gridRef.current) return

        const cards = Array.from(gridRef.current.querySelectorAll('.product-card')) as HTMLElement[]
        const ctx = scrollReveal(cards, { stagger: 0.1 })

        return () => ctx.revert()
    }, [filteredProducts])

    return (
        <div>
            {/* Filtros (Tabs) */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-mont-white rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => setSelectedCategory('todos')}
                        className={`px-6 py-3 rounded-md font-medium transition-all ${selectedCategory === 'todos'
                            ? 'bg-mont-gold text-mont-white shadow-sm'
                            : 'text-mont-gray hover:text-mont-espresso'
                            }`}
                    >
                        Todos
                    </button>

                    <button
                        onClick={() => setSelectedCategory('congelado')}
                        className={`px-6 py-3 rounded-md font-medium transition-all ${selectedCategory === 'congelado'
                            ? 'bg-mont-gold text-mont-white shadow-sm'
                            : 'text-mont-gray hover:text-mont-espresso'
                            }`}
                    >
                        ❄️ Congelados
                    </button>

                    <button
                        onClick={() => setSelectedCategory('refrigerado')}
                        className={`px-6 py-3 rounded-md font-medium transition-all ${selectedCategory === 'refrigerado'
                            ? 'bg-mont-gold text-mont-white shadow-sm'
                            : 'text-mont-gray hover:text-mont-espresso'
                            }`}
                    >
                        🧊 Refrigerados
                    </button>
                </div>
            </div>

            {/* Grid de Produtos */}
            <div
                ref={gridRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            category={product.category}
                            weight_kg={product.weight_kg}
                            price_cents={product.price_cents}
                            is_featured={product.is_featured}
                            image_url={product.primary_image_url || product.image_url}
                        />
                    </div>
                ))}
            </div>

            {/* Estado vazio */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-mont-gray text-lg">
                        Nenhum produto encontrado nesta categoria
                    </p>
                </div>
            )}
        </div>
    )
}
