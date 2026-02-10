'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { FloatingCheeseBread } from '@/components/visual/FloatingCheeseBread'
import { useRef } from 'react'

export default function BrandStory() {
    const p1Ref = useScrollAnimation({ delay: 0.1 })
    const p2Ref = useScrollAnimation({ delay: 0.2 })
    const p3Ref = useScrollAnimation({ delay: 0.3 })
    const breadRef = useRef(null)

    return (
        <section id="brand-story" className="py-20 md:py-32 bg-transparent relative overflow-hidden">
            {/* Decorative Bread */}
            <div ref={breadRef} className="absolute -left-10 top-10 opacity-10 hidden md:block">
                <FloatingCheeseBread size="xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-5xl text-mont-espresso mb-6">
                        Nossa História
                    </h2>

                    <div className="prose prose-lg mx-auto text-mont-gray">
                        <p ref={p1Ref} className="mb-4">
                            A Mont Distribuidora nasceu do amor pela comida de verdade.
                            Começamos pequenos, na cozinha de casa, fazendo pão de queijo
                            artesanal para amigos e família.
                        </p>

                        <p ref={p2Ref} className="mb-4">
                            Hoje, atendemos toda a região do ABC paulista com produtos
                            feitos com ingredientes naturais e muito carinho. Cada massa
                            é preparada seguindo receitas tradicionais, sem conservantes
                            ou aditivos artificiais.
                        </p>

                        <p ref={p3Ref}>
                            Nosso compromisso é levar até você o sabor autêntico do pão
                            de queijo mineiro, feito com alma e dedicação.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
