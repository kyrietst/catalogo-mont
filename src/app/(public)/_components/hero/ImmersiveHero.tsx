'use client'

import React from 'react'
import ScrollWrapper from './ScrollWrapper'
import HeroCopy from './HeroCopy'
import FloatingPaes from './FloatingPaes'
import PaoDeQueijo from './PaoDeQueijo'
import DiveOverlay from './DiveOverlay'


export default function ImmersiveHero() {
    return (
        <ScrollWrapper>
            {/* Background */}
            <div className="absolute inset-0 bg-[#3D2B22]" />

            <HeroCopy />
            <FloatingPaes />
            <PaoDeQueijo />
            <DiveOverlay />
        </ScrollWrapper>
    )
}
