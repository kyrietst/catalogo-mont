'use client'

import React, { useLayoutEffect, useRef, useState, useMemo } from 'react'
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
    scrollProgressRef: React.MutableRefObject<number> | null
}>({
    timeline: null,
    scrollProgressRef: null
})

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollProgressRef = useRef<number>(0)
    const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null)

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
                    scrub: 1.0,
                    onUpdate: (self) => {
                        scrollProgressRef.current = self.progress
                    }
                }
            })

            setTimeline(tl)

        }, wrapperRef)

        return () => ctx.revert()
    }, [])

    const contextValue = useMemo(() => ({
        timeline,
        scrollProgressRef
    }), [timeline])

    return (
        <HeroContext.Provider value={contextValue}>
            {/* 
                O container principal tem 600vh para dar espaço de rolagem.
                O conteúdo fixo (pinned) tem 100vh.
             */}
            <div ref={wrapperRef} data-hero-wrapper className="relative w-full h-[500vh] bg-[#3D2B22]">
                <div ref={contentRef} className="w-full h-[100dvh] overflow-hidden">
                    {children}
                </div>
            </div>
        </HeroContext.Provider>
    )
}
