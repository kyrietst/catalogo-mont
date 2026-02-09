'use client'

import { useEffect, useRef } from 'react'
import { heroTextReveal, parallaxImage } from '@/lib/gsap/animations'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function HeroSection() {
    const heroRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!titleRef.current || !imageRef.current) return

        const ctx = heroTextReveal(titleRef.current)
        const imgCtx = parallaxImage(imageRef.current)

        return () => {
            ctx.revert()
            imgCtx.revert()
        }
    }, [])

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mont-espresso"
        >
            {/* Background Image com Parallax */}
            <div
                ref={imageRef}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/images/hero-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-mont-espresso/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <h1
                    ref={titleRef}
                    className="font-display text-5xl md:text-7xl lg:text-8xl text-mont-cream mb-6 leading-tight"
                >
                    Pão de queijo artesanal.
                    <br />
                    Feito com alma.
                </h1>

                <p className="text-mont-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                    Massas naturais congeladas e refrigeradas direto pra sua casa.
                    <br />
                    Tradição familiar na região do ABC paulista.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/produtos">
                        <Button variant="primary" size="lg">
                            Ver Produtos
                        </Button>
                    </Link>

                    <Link href="#como-funciona">
                        <Button variant="secondary" size="lg">
                            Como Funciona
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <div className="w-6 h-10 border-2 border-mont-cream/50 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-mont-cream/50 rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    )
}
