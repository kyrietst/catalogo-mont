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

    // Combine logic into a single effect to guarantee order:
    // 1. Set Height -> 2. Create Pin -> 3. Add Resize Listener
    useLayoutEffect(() => {
        if (!wrapperRef.current || !contentRef.current) return

        // 1. Initial Height Set
        const setHeight = () => {
            if (contentRef.current) {
                contentRef.current.style.height = `${window.innerHeight}px`
            }
        }
        setHeight()

        // 2. GSAP Context & Pin Check
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: contentRef.current,
                    pinSpacing: false,
                    scrub: 1.0,
                    onUpdate: (self) => {
                        scrollProgressRef.current = self.progress
                    },
                    // Add invalidateOnRefresh to handle dynamic height changes better
                    invalidateOnRefresh: true
                }
            })

            setTimeline(tl)

        }, wrapperRef)

        // 3. Resize Listener
        const handleResize = () => {
            setHeight()
            // Force refresh after height change
            ScrollTrigger.refresh()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            ctx.revert()
        }
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
                className="relative w-full h-[350vh]"
                style={{
                    background: 'linear-gradient(to bottom, #0D0603 0%, #0D0603 80%, #FAF7F2 95%, #FAF7F2 100%)'
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
