'use client'

import { useEffect, useRef } from 'react'
import { ProductCard } from '@/components/catalog'
import { scrollReveal } from '@/lib/gsap/animations'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Product } from '@/types/product'

interface FeaturedProductsProps {
    products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current) return
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            // --- EFEITO DE PROFUNDIDADE (parallax Z) ---
            // A seção inteira começa "atrás" e vem pra frente
            gsap.fromTo(sectionRef.current,
                {
                    y: 120,          // Começa 120px abaixo
                    scale: 0.88,     // Começa menor (como se estivesse mais longe)
                    opacity: 0.3,    // Levemente transparente
                },
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 100%',    // Começa quando o topo da seção atinge o fundo da viewport
                        end: 'top 30%',       // Termina quando o topo da seção atinge 30% da viewport
                        scrub: 1.5,           // Suave, atrelado ao scroll
                    }
                }
            )

            // --- CARDS INDIVIDUAIS (mantém o reveal existente) ---
            if (gridRef.current) {
                const cards = Array.from(
                    gridRef.current.querySelectorAll('.product-card')
                ) as HTMLElement[]

                if (cards.length > 0) {
                    scrollReveal(cards, { stagger: 0.15 })
                }
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [products])

    if (products.length === 0) return null

    return (
        <section
            ref={sectionRef}
            className="pt-8 pb-20 md:pt-12 md:pb-32 bg-transparent"
            id="destaques"
            style={{
                transformOrigin: 'center top',  // Scale a partir do topo central
                willChange: 'transform, opacity' // Performance hint pro browser
            }}
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
                                image_url={product.primary_image_url}
                                is_featured={index === 0}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
