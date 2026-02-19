'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function IngredientsSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)

    // Unicode Strings
    const headline = "5 ingredientes. Zero atalhos."
    const subtitle = "\u00C9 por isso que n\u00E3o murcha, n\u00E3o \u00E9 oco e o sabor n\u00E3o some no forno."

    const ingredients = [
        {
            emoji: '\uD83E\uDDC0',
            nome: 'Queijo Canastra',
            descricao: 'O ingrediente que ningu\u00E9m substitui aqui'
        },
        {
            emoji: '\uD83C\uDF3F',
            nome: 'F\u00E9cula de mandioca',
            descricao: 'A base leve que d\u00E1 a textura certa'
        },
        {
            emoji: '\uD83E\uDD5A',
            nome: 'Ovos',
            descricao: 'Estrutura e maciez em cada unidade'
        },
        {
            emoji: '\uD83E\uDEB4',
            nome: '\u00D3leo de soja',
            descricao: 'Equil\u00EDbrio no ponto certo'
        },
        {
            emoji: '\uD83E\uDDC2',
            nome: 'Sal',
            descricao: 'S\u00F3 o necess\u00E1rio'
        }
    ]

    const footerText = "\u00C9 por isso que n\u00E3o murcha. \u00C9 por isso que n\u00E3o \u00E9 oco. Ingrediente certo, resultado certo."

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.from(headerRef.current?.children || [], {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: 'top 85%',
                }
            })

            // Grid items animation
            gsap.from(gridRef.current?.children || [], {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 85%',
                }
            })

            // Footer phrase animation
            gsap.from(footerRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 90%',
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={containerRef}
            className="w-full bg-[#1C1008] py-14 px-6 md:py-16 md:px-10 relative overflow-hidden"
        >
            {/* Header Content */}
            <div ref={headerRef} className="flex flex-col items-center mb-10">
                <h2 className="font-display text-2xl md:text-3xl text-mont-cream text-center mb-2">
                    {headline}
                </h2>

                {/* Gold Separator */}
                <div className="w-12 h-px bg-mont-gold mb-10" />

                <p className="text-sm md:text-base text-mont-cream/60 text-center max-w-sm mx-auto leading-relaxed">
                    {subtitle}
                </p>
            </div>

            {/* Ingredients Grid */}
            <div
                ref={gridRef}
                className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto"
            >
                {ingredients.map((item, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center text-center gap-2 ${index === 4 ? 'col-span-2 md:col-span-1 flex justify-center' : ''
                            }`}
                    >
                        <span className="text-4xl">{item.emoji}</span>
                        <h3 className="font-display text-sm text-mont-cream font-normal">
                            {item.nome}
                        </h3>
                        <p className="text-xs text-mont-cream/50 leading-snug max-w-[120px]">
                            {item.descricao}
                        </p>
                    </div>
                ))}
            </div>

            {/* Footer Phrase */}
            <div
                ref={footerRef}
                className="max-w-md mx-auto mt-10"
            >
                <div className="border-t border-mont-cream/10 mb-8" />
                <p className="font-display text-base md:text-lg text-mont-cream/80 text-center leading-relaxed">
                    {footerText}
                </p>
            </div>
        </section>
    )
}
