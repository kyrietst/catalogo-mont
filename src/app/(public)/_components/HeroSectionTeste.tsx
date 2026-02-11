'use client'

import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HeroSectionTeste() {
    const containerRef = useRef<HTMLElement>(null)
    const cheeseRef = useRef<HTMLImageElement>(null)
    const breadLeftRef = useRef<HTMLImageElement>(null)
    const breadRightRef = useRef<HTMLImageElement>(null)

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        // Criamos o gerenciador de mídia
        const mm = gsap.matchMedia()

        // Adicionamos o container ao contexto do GSAP para limpeza automática
        const ctx = gsap.context(() => {
            if (!containerRef.current || !cheeseRef.current || !breadLeftRef.current || !breadRightRef.current) return

            // --- CONFIGURAÇÃO COMUM (Base) ---
            const centerConfig = {
                xPercent: -50,
                yPercent: -50,
                transformOrigin: 'center center'
            }

            // Reset inicial garantido
            gsap.set([breadLeftRef.current, breadRightRef.current], { x: 0, ...centerConfig })
            gsap.set(cheeseRef.current, {
                opacity: 1,
                x: 0,
                ...centerConfig
            })

            // ============================================================
            // 📱 REGRA 1: CELULAR (Max-width 768px)
            // ============================================================
            // Time que está ganhando não se mexe!
            mm.add("(max-width: 768px)", () => {
                gsap.set(cheeseRef.current, { scaleX: 0.25, x: 0 })

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=150%',
                        pin: true,
                        scrub: 0.5,
                    }
                })

                tl.to(breadLeftRef.current, { x: '-35vw', duration: 1, ease: 'power2.inOut' }, 0)
                tl.to(breadRightRef.current, { x: '35vw', duration: 1, ease: 'power2.inOut' }, 0)

                tl.to(cheeseRef.current, {
                    scaleX: 3.1,
                    x: '12vw',
                    duration: 1,
                    ease: 'power2.inOut'
                }, 0)
            })

            // ============================================================
            // 💻 REGRA 2: DESKTOP (Min-width 769px) - CALIBRAÇÃO PROPORCIONAL
            // ============================================================
            mm.add("(min-width: 769px)", () => {
                // Setup Inicial Desktop
                gsap.set(cheeseRef.current, { scaleX: 0.35, x: 0 })

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=150%',
                        pin: true,
                        scrub: 0.5,
                    }
                })

                // 1. Pão: 22vw (Abertura controlada para monitores grandes)
                tl.to(breadLeftRef.current, { x: '-22vw', duration: 1, ease: 'power2.inOut' }, 0)
                tl.to(breadRightRef.current, { x: '22vw', duration: 1, ease: 'power2.inOut' }, 0)

                // 2. Queijo: Escala reduzida para acompanhar o pão
                // Antes estava 4.5 ou 6.0 (Muito rápido/grande)
                // Agora 2.4 (Velocidade sincronizada com a distância de 22vw)
                tl.to(cheeseRef.current, {
                    scaleX: 2.4,
                    x: '9vw',      // Deslocamento proporcional para corrigir a assimetria da imagem
                    duration: 1,
                    ease: 'power2.inOut'
                }, 0)
            })

        }, containerRef)

        return () => {
            mm.revert()
            ctx.revert()
        }
    }, [])

    return (
        <section
            ref={containerRef}
            className="relative w-full h-screen bg-[#3D2B22] flex items-center justify-center overflow-hidden"
        >
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 text-white/50 text-sm font-light tracking-widest uppercase animate-pulse">
                Role para abrir
            </div>

            {/* --- IMAGENS --- */}

            <img
                ref={cheeseRef}
                src="/hero-cheese/cheese.png"
                alt="Queijo derretido"
                className="absolute left-1/2 top-1/2 w-[100vw] h-[50vh] md:h-[60vh] object-fill pointer-events-none"
                style={{ zIndex: 10 }}
            />

            <img
                ref={breadLeftRef}
                src="/hero-cheese/pao_left.png"
                alt="Pão metade esquerda"
                className="absolute left-1/2 top-1/2 h-auto max-h-[60vh] md:max-h-[80vh] object-contain pointer-events-none"
                style={{ zIndex: 20 }}
            />

            <img
                ref={breadRightRef}
                src="/hero-cheese/pao_right.png"
                alt="Pão metade direita"
                className="absolute left-1/2 top-1/2 h-auto max-h-[60vh] md:max-h-[80vh] object-contain pointer-events-none"
                style={{ zIndex: 20 }}
            />

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-white/30 text-xs">
                Role para baixo
            </div>
        </section>
    )
}