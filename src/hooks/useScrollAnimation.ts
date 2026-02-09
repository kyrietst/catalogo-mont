'use client'

import { useEffect, useRef } from 'react'
import { scrollReveal, cleanupScrollTriggers } from '@/lib/gsap/animations'

interface UseScrollAnimationOptions {
    stagger?: number
    enabled?: boolean
}

/**
 * Hook para aplicar scroll reveal animation em elementos
 * 
 * @example
 * const ref = useScrollAnimation<HTMLDivElement>()
 * return <div ref={ref} className="animate-target">Content</div>
 */
export function useScrollAnimation<T extends HTMLElement>(
    options: UseScrollAnimationOptions = {}
) {
    const { stagger = 0.1, enabled = true } = options
    const ref = useRef<T>(null)

    useEffect(() => {
        if (!enabled || !ref.current) return

        const elements = ref.current.querySelectorAll<HTMLElement>('.animate-target')

        if (elements.length > 0) {
            scrollReveal(Array.from(elements), { stagger })
        } else {
            // Se não houver .animate-target, anima o próprio elemento
            scrollReveal([ref.current], { stagger })
        }

        return () => {
            cleanupScrollTriggers()
        }
    }, [stagger, enabled])

    return ref
}
