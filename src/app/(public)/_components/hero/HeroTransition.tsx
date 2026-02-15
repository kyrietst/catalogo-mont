'use client'

import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * HeroTransition — Overlay creme que faz a transição do hero para os produtos.
 *
 * Fica FORA do ScrollWrapper (não é pinnado) para garantir que persiste
 * após o GSAP liberar o pin. Usa seu próprio ScrollTrigger vinculado
 * ao mesmo wrapper via data-attribute.
 */
export default function HeroTransition() {
    const overlayRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!overlayRef.current) return

        const wrapper = document.querySelector('[data-hero-wrapper]')
        if (!wrapper) return

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: wrapper,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress
                    let opacity = 0

                    if (progress < 0.78) {
                        opacity = 0
                    } else if (progress < 0.90) {
                        // fade-in: mapear 0.78-0.90 para 0-1
                        opacity = (progress - 0.78) / (0.90 - 0.78)
                    } else if (progress < 0.95) {
                        // segura
                        opacity = 1
                    } else if (progress < 1.00) {
                        // fade-out: mapear 0.95-1.00 para 1-0
                        opacity = 1 - (progress - 0.95) / (1.00 - 0.95)
                    } else {
                        opacity = 0
                    }

                    gsap.set(overlayRef.current, { opacity })
                },
                onLeave: () => {
                    gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' })
                },
                onLeaveBack: () => {
                    gsap.set(overlayRef.current, { opacity: 0 })
                }
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-[#FAF7F2] opacity-0 pointer-events-none z-[35]"
            style={{ willChange: 'opacity' }}
        />
    )
}
