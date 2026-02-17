'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import gsap from 'gsap'

export default function DiveOverlay() {
    const { timeline } = useContext(HeroContext)
    const bgFadeRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!timeline || !bgFadeRef.current) return

        const ctx = gsap.context(() => {
            // Fade do fundo: marrom → cor do catálogo
            // Começa quando o dive já está avançado (cena quase invisível)
            // e termina antes do pin liberar
            timeline.fromTo(bgFadeRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 10,
                    ease: 'power1.inOut'
                },
                35  // Ajustar conforme necessário — deve começar
                // quando a cena do dive já está quase invisível
            )
        }, bgFadeRef)

        return () => ctx.revert()
    }, [timeline])

    return (
        <div ref={bgFadeRef} className="absolute inset-0 z-30 pointer-events-none opacity-0"
            style={{ backgroundColor: '#FAF7F2' }}
        />
    )
}
