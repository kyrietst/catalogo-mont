'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BenefitsCarousel() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Unicode Strings
    const sectionTitle = "Por que a Mont \u00E9 diferente?"

    const benefits = [
        {
            emoji: '\uD83E\uDDC0',
            titulo: 'Queijo Canastra de verdade',
            descricao: 'N\u00E3o \u00E9 sabor artificial. \u00C9 o queijo mais nobre de Minas, sem substitui\u00E7\u00E3o.'
        },
        {
            emoji: '\uD83D\uDCAA',
            titulo: 'N\u00E3o \u00E9 oco, n\u00E3o murcha',
            descricao: 'Quantidade certa de queijo garante estrutura e sabor do in\u00EDcio ao fim.'
        },
        {
            emoji: '\uD83D\uDEAB',
            titulo: 'Sem conservantes',
            descricao: 'S\u00F3 o que a natureza oferece. Nada mais, nada menos.'
        },
        {
            emoji: '\uD83D\uDD25',
            titulo: 'Pronto em 20 minutos',
            descricao: 'Do freezer direto pro forno. Sem descongelar, sem complica\u00E7\u00E3o.'
        }
    ]

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={containerRef}
            className="bg-mont-cream py-12 px-4 md:py-14 overflow-hidden"
        >
            <h2 className="font-display text-xl md:text-2xl text-mont-espresso pl-4 mb-6">
                {sectionTitle}
            </h2>

            <div
                className="flex overflow-x-auto scroll-snap-x mandatory snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-4 px-4 pb-4"
            >
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="min-w-[82vw] sm:min-w-[320px] scroll-snap-align-start snap-start flex-shrink-0 bg-white rounded-2xl p-5 shadow-sm border border-mont-espresso/10"
                    >
                        <div className="text-3xl mb-3">{benefit.emoji}</div>
                        <h3 className="font-display text-base text-mont-espresso font-semibold mb-1">
                            {benefit.titulo}
                        </h3>
                        <p className="text-xs text-mont-espresso/60 leading-relaxed">
                            {benefit.descricao}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
