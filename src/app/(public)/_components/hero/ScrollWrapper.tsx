'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugin globally (safe in Next.js client components)
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface ScrollWrapperProps {
    children: React.ReactNode
}

export const HeroContext = React.createContext<{
    timeline: gsap.core.Timeline | null
    scrollProgress: number
}>({
    timeline: null,
    scrollProgress: 0
})

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null)
    const [scrollProgress, setScrollProgress] = useState(0)

    useLayoutEffect(() => {
        if (!wrapperRef.current || !contentRef.current) return

        const ctx = gsap.context(() => {
            // Master Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: contentRef.current,
                    pinSpacing: false, // Important so we scroll "through" the 600vh
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => setScrollProgress(self.progress)
                }
            })

            setTimeline(tl)

        }, wrapperRef)

        return () => ctx.revert()
    }, [])

    return (
        <HeroContext.Provider value={{ timeline, scrollProgress }}>
            {/* 
                O container principal tem 600vh para dar espaço de rolagem.
                O conteúdo fixo (pinned) tem 100vh.
             */}
            <div ref={wrapperRef} data-hero-wrapper className="relative w-full h-[600vh] bg-[#3D2B22]">
                <div ref={contentRef} className="w-full h-screen overflow-hidden">
                    {children}
                </div>
            </div>
        </HeroContext.Provider>
    )
}
