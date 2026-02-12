'use client'

import React from 'react'
import ScrollWrapper from './ScrollWrapper'
import HeroCopy from './HeroCopy'
import FloatingPaes from './FloatingPaes'
import PaoDeQueijo from './PaoDeQueijo'
import CheeseStrings from './CheeseStrings'
import DiveOverlay from './DiveOverlay'

export default function ImmersiveHero() {
    return (
        <ScrollWrapper>
            {/* Visual Debugging - Will be removed later */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="text-white/20 text-xs font-mono">
                    Immersive Hero Active
                </div>
            </div>

            {/* Background */}
            <div className="absolute inset-0 bg-[#3D2B22]" />

            <HeroCopy />
            <FloatingPaes />
            <PaoDeQueijo />
            <CheeseStrings />
            <DiveOverlay />

        </ScrollWrapper>
    )
}
