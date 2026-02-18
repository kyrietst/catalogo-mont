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
    // Removed state to avoid re-renders clashing with GSAP pin

    useLayoutEffect(() => {
        const updateHeight = () => {
            if (contentRef.current) {
                // Direct DOM manipulation to avoid React re-render cycle breaking GSAP pin
                contentRef.current.style.height = `${window.innerHeight}px`
                // Force ScrollTrigger to re-calculate pin spacers
                ScrollTrigger.refresh()
            }
        }
        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [])

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
            <div
                ref={wrapperRef}
                data-hero-wrapper
                className="relative w-full h-[500vh]"
                style={{
                    background: 'linear-gradient(to bottom, #3D2B22 0%, #3D2B22 80%, #FAF7F2 95%, #FAF7F2 100%)'
                }}
            >
                {/* Fallback height for SSR/Initial render before JS kicks in */}
                <div ref={contentRef} className="w-full h-screen overflow-hidden">
                    {children}
                </div>
            </div>
        </HeroContext.Provider>
    )
}
