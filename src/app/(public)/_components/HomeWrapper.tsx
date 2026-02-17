'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HomeWrapper({ children }: { children: React.ReactNode }) {
    const mainRef = useRef<HTMLElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            // Apenas as seções que precisam de transição de cor ENTRE SI
            // (não mais a transição hero → destaques)
            const sections = [
                { selector: '#como-funciona', color: '#F5F0E8' },
                { selector: '#brand-story', color: '#FAF7F2' },
                { selector: '#final-cta', color: '#3D2B22' }
            ]

            sections.forEach(({ selector, color }) => {
                if (!document.querySelector(selector)) return

                ScrollTrigger.create({
                    trigger: selector,
                    start: 'top 60%',
                    end: 'top 20%',
                    scrub: true,
                    animation: gsap.to(mainRef.current, {
                        backgroundColor: color,
                        ease: 'none'
                    })
                })
            })
        }, mainRef)

        return () => ctx.revert()
    }, [])

    // Cor inicial agora é CREME (#FAF7F2) — o hero tem seu próprio fundo marrom
    return (
        <main ref={mainRef} className="min-h-screen bg-[#FAF7F2]">
            {children}
        </main>
    )
}
