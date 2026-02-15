'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HomeWrapper({ children }: { children: React.ReactNode }) {
    const mainRef = useRef<HTMLElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        const main = mainRef.current

        const ctx = gsap.context(() => {
            const sections = [
                { selector: '#destaques', color: '#FAF7F2' },
                { selector: '#como-funciona', color: '#F5F0E8' },
                { selector: '#brand-story', color: '#FAF7F2' },
                { selector: '#final-cta', color: '#3D2B22' }
            ]

            sections.forEach(({ selector, color }) => {
                // Check if element exists before creating trigger to avoid warnings
                if (!document.querySelector(selector)) return;

                // Para #destaques (primeira seção após o hero), antecipar a
                // transição de cor para evitar a faixa marrom entre hero e produtos
                const startValue = selector === '#destaques' ? 'top 95%' : 'top 60%'
                const endValue = selector === '#destaques' ? 'top 60%' : 'top 20%'

                ScrollTrigger.create({
                    trigger: selector,
                    start: startValue,
                    end: endValue,
                    scrub: true,
                    animation: gsap.to(main, { backgroundColor: color, ease: 'none' })
                })
            })
        }, mainRef) // Scope to mainRef

        return () => ctx.revert()
    }, [])

    // Initial color matches Hero (#3D2B22)
    return (
        <main ref={mainRef} className="min-h-screen bg-[#3D2B22] transition-colors duration-300">
            {children}
        </main>
    )
}
