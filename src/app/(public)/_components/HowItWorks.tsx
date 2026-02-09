'use client'

import { useEffect, useRef } from 'react'
import { scrollReveal } from '@/lib/gsap/animations'

const steps = [
    {
        number: '01',
        title: 'Escolha',
        description: 'Navegue pelo catálogo e adicione seus produtos favoritos ao carrinho',
        icon: (
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Peça',
        description: 'Finalize pelo WhatsApp com entrega ou retirada no local',
        icon: (
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Receba',
        description: 'Receba em casa ou retire no nosso ponto em São Bernardo do Campo',
        icon: (
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
]

export default function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null)
    const stepsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!stepsRef.current) return

        const stepCards = Array.from(stepsRef.current.querySelectorAll('.step-card')) as HTMLElement[]
        const ctx = scrollReveal(stepCards, { stagger: 0.2 })

        return () => ctx.revert()
    }, [])

    return (
        <section
            id="como-funciona"
            ref={sectionRef}
            className="py-20 md:py-32 bg-mont-surface"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl md:text-5xl text-mont-espresso mb-4">
                        Como Funciona
                    </h2>
                    <p className="text-mont-gray text-lg max-w-2xl mx-auto">
                        Simples, rápido e direto. Do catálogo até a sua mesa.
                    </p>
                </div>

                <div
                    ref={stepsRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                >
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="step-card bg-mont-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-mont-gold mb-4">
                                {step.icon}
                            </div>

                            <div className="text-mont-gold/30 font-mono text-sm mb-2">
                                {step.number}
                            </div>

                            <h3 className="font-display text-2xl text-mont-espresso mb-3">
                                {step.title}
                            </h3>

                            <p className="text-mont-gray">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
