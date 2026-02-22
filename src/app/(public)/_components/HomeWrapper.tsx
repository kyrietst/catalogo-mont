'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HomeWrapper({ children }: { children: React.ReactNode }) {
    const mainRef = useRef<HTMLElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            gsap.set(document.documentElement, { backgroundColor: '#3D2B22' })

            // Mudar o fundo do <html> quando sair do hero
            ScrollTrigger.create({
                trigger: '#destaques',
                start: 'top 90%',
                end: 'top 50%',
                scrub: true,
                animation: gsap.to(document.documentElement,
                    { backgroundColor: '#FAF7F2', ease: 'none' }
                )
            })

            // Transições de cor do main entre seções
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

            // Quando chegar no final-cta (marrom), html também fica marrom
            if (document.querySelector('#final-cta')) {
                ScrollTrigger.create({
                    trigger: '#final-cta',
                    start: 'top 60%',
                    end: 'top 20%',
                    scrub: true,
                    animation: gsap.to(document.documentElement,
                        { backgroundColor: '#3D2B22', ease: 'none' }
                    )
                })
            }
        }, mainRef)

        return () => ctx.revert()
    }, [])

    return (
        <main ref={mainRef} className="min-h-screen bg-[#FAF7F2]">
            {children}
        </main>
    )
}
