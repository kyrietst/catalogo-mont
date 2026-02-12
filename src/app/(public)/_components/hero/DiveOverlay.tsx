'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import gsap from 'gsap'

export default function DiveOverlay() {
    const { timeline } = useContext(HeroContext)
    const containerRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const transitionRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!timeline || !containerRef.current) return

        const ctx = gsap.context(() => {

            // 1. Golden Glow (Aparece suavemente)
            // Scroll 58% -> 70%
            timeline.fromTo(glowRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 12,
                    ease: 'power2.inOut'
                },
                58
            )

            // 2. Intensificação do Glow (Brilho explode)
            // Scroll 68% -> 78%
            // Mudamos o gradiente ou escala para parecer que estamos entrando na luz
            timeline.to(glowRef.current, {
                scale: 1.5,
                duration: 10,
                ease: 'power1.in'
            }, 68)

            // 3. Transition Overlay (Cor sólida Creme)
            // Cobre tudo para a próxima seção
            // Scroll 78% -> 90%
            timeline.fromTo(transitionRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 12,
                    ease: 'power3.in' // Acelera no fim
                },
                78
            )

            // Cleanup: Glow some no final para não atrapalhar (opcional, já que o transition cobre)
            timeline.to(glowRef.current, { opacity: 0, duration: 2 }, 88)

        }, containerRef)

        return () => ctx.revert()

    }, [timeline])

    return (
        <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none">
            {/* Camada 1: Golden Glow */}
            <div
                ref={glowRef}
                className="absolute inset-0 opacity-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(250,204,66,0.6) 0%, rgba(245,183,49,0.3) 40%, transparent 70%)',
                    mixBlendMode: 'screen' // Ajuda a brilhar sobre o pão/fundo
                }}
            />

            {/* Camada 2: Solid Transition Color (#FAF7F2 - cor da seção de produtos) */}
            <div
                ref={transitionRef}
                className="absolute inset-0 bg-[#FAF7F2] opacity-0 z-40"
            />
        </div>
    )
}
