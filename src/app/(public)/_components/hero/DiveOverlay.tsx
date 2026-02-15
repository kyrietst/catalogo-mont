'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import gsap from 'gsap'

export default function DiveOverlay() {
    const { timeline } = useContext(HeroContext)
    const containerRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

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
            timeline.to(glowRef.current, {
                scale: 1.5,
                duration: 10,
                ease: 'power1.in'
            }, 68)

            // Glow some no final
            timeline.to(glowRef.current, { opacity: 0, duration: 2 }, 88)

        }, containerRef)

        return () => ctx.revert()
    }, [timeline])

    return (
        <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none">
            {/* Golden Glow */}
            <div
                ref={glowRef}
                className="absolute inset-0 opacity-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(250,204,66,0.6) 0%, rgba(245,183,49,0.3) 40%, transparent 70%)',
                    mixBlendMode: 'screen'
                }}
            />
        </div>
    )
}
