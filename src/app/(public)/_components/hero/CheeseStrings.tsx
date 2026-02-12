'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import gsap from 'gsap'

export default function CheeseStrings() {
    const { timeline } = useContext(HeroContext)
    const cheeseRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!timeline || !cheeseRef.current) return

        const ctx = gsap.context(() => {
            // Cheese aparece e estica durante o split (Scroll 44% -> 58%)
            // Começa invisível e "comprimido"
            timeline.fromTo(cheeseRef.current,
                { scaleX: 0.2, opacity: 0 },
                {
                    scaleX: 1,     // Estica horizontalmente
                    opacity: 1,
                    duration: 14,
                    ease: 'power2.out'
                },
                44
            )

            // Continua esticando um pouco mais enquanto as metades se separam mais
            timeline.to(cheeseRef.current, {
                scaleX: 1.5,
                duration: 8,
                ease: 'power1.out'
            }, 58)

            // Dive: explode e some junto com o pão (Scroll 62%+)
            timeline.to(cheeseRef.current, {
                scale: 3,
                opacity: 0,
                duration: 20,
                ease: 'power2.in'
            }, 62)

        }, cheeseRef)

        return () => ctx.revert()
    }, [timeline])

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div
                ref={cheeseRef}
                className="relative opacity-0 origin-center"
                style={{
                    // Ajustar width/height conforme o tamanho real do cheese.png
                    // A imagem deve cobrir o gap entre as metades
                    // O pão tem ~30vmin. O queijo deve ser menor em altura mas conectar as metades.
                    width: '40vmin',
                    height: '20vmin',
                }}
            >
                <img
                    src="/hero-cheese/cheese.png"
                    alt="Queijo derretido"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    )
}
