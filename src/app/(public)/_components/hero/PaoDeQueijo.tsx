'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import gsap from 'gsap'

export default function PaoDeQueijo() {
    const { timeline } = useContext(HeroContext)
    const sceneRef = useRef<HTMLDivElement>(null)
    const crustLeftRef = useRef<HTMLDivElement>(null)
    const crustRightRef = useRef<HTMLDivElement>(null)
    const cheeseRef = useRef<HTMLDivElement>(null)

    // Helper para calcular o scale necessário para preencher a tela
    const getFullscreenScale = () => {
        if (!sceneRef.current) return 1
        const currentH = sceneRef.current.offsetHeight
        const targetH = window.innerHeight * 1.1
        const targetW = window.innerWidth * 1.1   // Considerar largura também
        const target = Math.max(targetH, targetW)  // O maior dos dois garante cobertura
        const scaleH = targetH / currentH
        return scaleH < 1 ? 1 : scaleH
    }

    useLayoutEffect(() => {
        if (!timeline || !sceneRef.current || !crustLeftRef.current || !crustRightRef.current || !cheeseRef.current) return

        const ctx = gsap.context(() => {
            // --- ESTADO INICIAL ---
            // Garante que o queijo está invisível e bem pequeno desde o frame 0 (corrige o "ghosting")
            timeline.set(cheeseRef.current, {
                opacity: 0,
                scaleX: 0.1,
                scaleY: 0.1,
                visibility: 'hidden',
                pointerEvents: 'none'
            }, 0)



            // --- FASE 2: ZOOM (Scroll 15% -> 41%) ---
            timeline.fromTo(sceneRef.current,
                { scale: 1 },
                {
                    scale: () => getFullscreenScale(),
                    duration: 26,       // Aumentado levemente para overlap
                    ease: 'power2.inOut',
                    force3D: true
                },
                15
            )

            // --- FASE 3: SPLIT (Scroll 39% -> 51%) ---


            // Começa ANTES do zoom terminar (39) para suavizar a transição
            // Left Half
            timeline.fromTo(crustLeftRef.current,
                {
                    clipPath: 'inset(0 0% 0 0)',
                    xPercent: 0.5
                },
                {
                    clipPath: 'inset(0 50% 0 0)',
                    xPercent: -40,
                    duration: 12,       // Um pouco mais longo para suavidade
                    ease: 'power2.inOut'
                },
                39
            )

            // Right Half
            timeline.fromTo(crustRightRef.current,
                {
                    clipPath: 'inset(0 0 0 0%)',
                    xPercent: -0.5
                },
                {
                    clipPath: 'inset(0 0 0 50%)',
                    xPercent: 40,
                    duration: 12,
                    ease: 'power2.inOut'
                },
                39
            )

            // --- CHEESE ANIMATION (Scroll 39% -> 51%) ---
            // Aparece e estica sincronizado com o split
            timeline.set(cheeseRef.current, {
                visibility: 'visible',
                pointerEvents: 'auto',
                scaleX: 1.0, // Começa em tamanho normal para não parecer "encolhido"
                scaleY: 0.6  // Já na altura final
            }, 39)

            // Opacidade surge rápido (duration 3) mas com leve atraso
            timeline.to(cheeseRef.current, {
                opacity: 1,
                duration: 3,
                ease: 'power1.out'
            }, 42) // Atrasado para 42 (era 39) para não vazar antes de abrir

            // Estiramento progressivo (duration 12 para acompanhar o pão)
            timeline.to(cheeseRef.current, {
                scaleX: () => {
                    // Calcular scale necessário baseado na viewport
                    // Em telas menores, scale menor para evitar overflow excessivo
                    const vw = window.innerWidth
                    if (vw <= 480) return 2.0      // Mobile
                    if (vw <= 768) return 2.5      // Tablet
                    return 3.0                      // Desktop
                },
                scaleY: 0.6,
                duration: 12,
                ease: 'power2.inOut'
            }, 39)

            // --- FASE 4: DIVE (Sloooow zoom) ---
            // Começa ANTES do split terminar (49) para um flow contínuo
            timeline.to(sceneRef.current, {
                scale: () => getFullscreenScale() * 5,
                opacity: 0,
                duration: 36,
                ease: 'power2.inOut',
                force3D: true
            }, 49)

        }, sceneRef)

        return () => ctx.revert()
    }, [timeline])

    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div
                ref={sceneRef}
                className="relative w-[50vmin] h-[50vmin] md:w-[40vmin] md:h-[40vmin]"
            >
                {/* --- Left Half --- */}
                <div
                    ref={crustLeftRef}
                    className="absolute inset-0 w-full h-full z-10"
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
                    className="absolute inset-0 w-full h-full z-10"
                    style={{ clipPath: 'inset(0 0 0 0)' }}
                >
                    <img
                        src="/hero-cheese/pao_right.png"
                        alt="Pão Direita"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* --- Cheese (DENTRO do scene, herda o scale do pai) --- */}
                <div
                    ref={cheeseRef}
                    className="absolute opacity-0 z-[5]"
                    style={{
                        top: '15%',       // Menos agressivo que 28% para evitar o corte seco
                        bottom: '15%',
                        left: '-30%',
                        right: '-30%',
                        // Máscara para suavizar as bordas (feathering em 4 lados)
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)',
                        WebkitMaskComposite: 'source-in' as any,
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)',
                        maskComposite: 'intersect' as any
                    }}
                >
                    {/* Wrapper de offset — ajustar translateX aqui para posicionar */}
                    <div
                        className="w-full h-full"
                        style={{
                            transform: 'translateX(10px)',  // Mantendo o offset que o usuário encontrou (10px)
                        }}
                    >
                        <img
                            src="/hero-cheese/cheese.png"
                            alt="Queijo derretido"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
