'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import gsap from 'gsap'

export default function PaoDeQueijo() {
    const { timeline } = useContext(HeroContext)
    const sceneRef = useRef<HTMLDivElement>(null)
    const crustLeftRef = useRef<HTMLDivElement>(null)
    const crustRightRef = useRef<HTMLDivElement>(null)

    // Helper para calcular o scale necessário para preencher a tela
    const getFullscreenScale = () => {
        if (!sceneRef.current) return 1
        const currentH = sceneRef.current.offsetHeight
        const targetH = window.innerHeight * 0.85
        const scaleH = targetH / currentH
        return scaleH < 1 ? 1 : scaleH
    }

    useLayoutEffect(() => {
        if (!timeline || !sceneRef.current || !crustLeftRef.current || !crustRightRef.current) return

        const ctx = gsap.context(() => {
            // --- FASE 2: ZOOM (Scroll 15% -> 40%) ---
            timeline.fromTo(sceneRef.current,
                { scale: 1 },
                {
                    scale: () => getFullscreenScale(),
                    duration: 25,
                    ease: 'power2.inOut',
                    force3D: true
                },
                15
            )

            // --- FASE 3: SPLIT (Scroll 40% -> 60%) ---

            // Left Half
            timeline.fromTo(crustLeftRef.current,
                {
                    clipPath: 'inset(0 0% 0 0)',
                    xPercent: 0
                },
                {
                    clipPath: 'inset(0 50% 0 0)',
                    xPercent: -40,
                    duration: 20,
                    ease: 'power2.inOut'
                },
                40
            )

            // Right Half
            timeline.fromTo(crustRightRef.current,
                {
                    clipPath: 'inset(0 0 0 0%)',
                    xPercent: 0
                },
                {
                    clipPath: 'inset(0 0 0 50%)',
                    xPercent: 40,
                    duration: 20,
                    ease: 'power2.inOut'
                },
                40
            )

            // --- FASE 4: DIVE (Scroll 62% -> 84%) ---
            timeline.to(sceneRef.current, {
                scale: () => getFullscreenScale() * 5,
                opacity: 0,
                duration: 22,
                ease: 'power2.in',
                force3D: true
            }, 62)

        }, sceneRef)

        return () => ctx.revert()
    }, [timeline])

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div
                ref={sceneRef}
                className="relative w-[40vmin] h-[40vmin] md:w-[30vmin] md:h-[30vmin]"
            >
                {/* --- Left Half --- */}
                <div
                    ref={crustLeftRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ clipPath: 'inset(0 0 0 0)' }}
                >
                    <img
                        src="/hero-cheese/pao_left.png"
                        alt="Pão Esquerda"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* --- Right Half --- */}
                <div
                    ref={crustRightRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ clipPath: 'inset(0 0 0 0)' }}
                >
                    <img
                        src="/hero-cheese/pao_right.png"
                        alt="Pão Direita"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </div>
    )
}
