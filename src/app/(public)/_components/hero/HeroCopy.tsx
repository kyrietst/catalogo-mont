'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import { ArrowDown } from 'lucide-react'
import gsap from 'gsap'

export default function HeroCopy() {
    const { timeline } = useContext(HeroContext)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollHintRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!timeline || !containerRef.current || !scrollHintRef.current) return

        // Fade Out Sequence
        // Scroll 8% -> 12%: Scroll Hint fade out
        timeline.to(scrollHintRef.current, {
            opacity: 0,
            y: -20,
            duration: 4, // 4% do scroll duration (assuming 100 total)
            ease: 'power2.in'
        }, 8) // Start at 8

        // Scroll 10% -> 16%: Container fade out
        timeline.to(containerRef.current, {
            opacity: 0,
            y: -50,
            duration: 6,
            ease: 'power2.in'
        }, 10)

    }, [timeline])

    return (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
            <div ref={containerRef} className="text-center px-4 max-w-4xl mt-[-10vh]">
                <h1 className="text-[#FAF7F2] font-black leading-[1.1] mb-6 tracking-tight hero-title">
                    O sabor que só o <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#E8601C] to-[#C43E1A]">
                        artesanal
                    </span> tem
                </h1>

                <p className="text-[#C4B5A5] text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
                    Massa natural de pão de queijo, feita com ingredientes selecionados
                    para assar na sua casa.
                </p>

                <button className="bg-[#E8601C] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#D45010] transition-colors shadow-lg hover:shadow-xl pointer-events-auto transform hover:scale-105 duration-300">
                    Peça pelo WhatsApp
                </button>
            </div>

            <div
                ref={scrollHintRef}
                className="absolute bottom-12 flex flex-col items-center gap-2 text-[#FAF7F2]/50 animate-bounce"
            >
                <span className="text-sm uppercase tracking-widest font-light">Role para descobrir</span>
                <ArrowDown size={20} />
            </div>

            <style jsx global>{`
                .hero-title {
                    font-size: clamp(2.5rem, 8vw, 5rem);
                }
            `}</style>
        </div>
    )
}
