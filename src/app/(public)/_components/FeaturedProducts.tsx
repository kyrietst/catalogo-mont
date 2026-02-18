'use client'

import { useEffect, useRef } from 'react'
import { ProductCard } from '@/components/catalog'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Product } from '@/types/product'

interface FeaturedProductsProps {
    products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current || !contentRef.current) return
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            // --- EFEITO 3D: Arco de trás pra frente ---
            gsap.fromTo(contentRef.current,
                {
                    rotateX: -65,          // ERA -50 — bem mais inclinado pra trás
                    y: 350,                // ERA 300 — começa mais embaixo
                    scale: 0.45,           // ERA 0.55 — começa bem menor (mais longe)
                    opacity: 0,
                    z: -200,               // NOVO — empurra pra trás no eixo Z real
                },
                {
                    rotateX: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    z: 0,                  // Volta pra posição original
                    ease: 'power4.out',    // ERA power3.out — arco mais agressivo
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 100%',
                        end: 'top 10%',    // ERA 'top 15%' — completa mais tarde (mais scroll pra apreciar o arco)
                        scrub: 1.2,
                    }
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [products])

    if (products.length === 0) return null

    return (
        <section
            ref={sectionRef}
            className="pt-8 pb-20 md:pt-12 md:pb-32 bg-transparent relative z-10"
            id="destaques"
            style={{
                marginTop: '-90vh',           // ERA -120vh — produtos entram um pouco mais tarde
                perspective: '600px',         // ERA 800px — mais intenso
                perspectiveOrigin: '50% 10%', // ERA 50% 20% — ponto de fuga mais alto
            }}
        >
            <div
                ref={contentRef}
                style={{
                    transformOrigin: 'center bottom',
                    willChange: 'transform, opacity',
                    transformStyle: 'preserve-3d',
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
            </div>
        </section>
    )
}
