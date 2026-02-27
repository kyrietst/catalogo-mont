'use client'

import { useRef } from 'react'
import Image from 'next/image'

export default function BenefitsCarousel() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Unicode Strings
    const sectionTitle = "Por que a Mont é diferente?"

    const benefits = [
        {
            id: 1,
            imagePath: '/images/benefits/queijo-verdade.png',
            title: 'Queijo Canastra de verdade',
            description: 'Usamos o legítimo queijo da Serra da Canastra em abundância em todas as nossas receitas.'
        },
        {
            id: 2,
            imagePath: '/images/benefits/nao-oco.png',
            title: 'Não é oco, não murcha',
            description: 'Diferente dos industriais, nosso pão de queijo é densamente recheado e mantém a estrutura após assar.'
        },
        {
            id: 3,
            imagePath: '/images/benefits/sem conservantes.png',
            title: 'Sem conservantes',
            description: 'Apenas ingredientes naturais e frescos, garantindo uma alimentação saudável para sua família.'
        },
        {
            id: 4,
            imagePath: '/images/benefits/pronto-20min.png',
            title: 'Pronto em 20 minutos',
            description: 'A praticidade que você precisa com o sabor da padaria artesanal, direto do seu congelador.'
        }
    ]

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
                {benefits.map((benefit) => (
                    <div
                        key={benefit.id}
                        className="min-w-[82vw] sm:min-w-[320px] scroll-snap-align-start snap-start flex-shrink-0 bg-white rounded-2xl p-5 shadow-sm border border-mont-espresso/10"
                    >
                        <div className="mb-3">
                            <Image
                                src={benefit.imagePath}
                                width={180}
                                height={180}
                                alt={benefit.title}
                                className="object-contain"
                            />
                        </div>
                        <h3 className="font-display text-base text-mont-espresso font-semibold mb-1">
                            {benefit.title}
                        </h3>
                        <p className="text-xs text-mont-espresso/60 leading-relaxed">
                            {benefit.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
