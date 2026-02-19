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
            {/* Background artesanal — imagem de forno lenha + bancada */}
            <div className="absolute inset-0 overflow-hidden">

                {/* Imagem de fundo responsiva */}
                <picture>
                    <source
                        media="(max-width: 768px)"
                        srcSet="/hero/hero-bg-mobile.png"
                    />
                    <img
                        src="/hero/hero-bg-desktop.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        style={{ willChange: 'transform' }}
                        fetchPriority="high"
                        decoding="async"
                    />
                </picture>



            </div>

            <HeroCopy />
            <FloatingPaes />
            <PaoDeQueijo />
            <DiveOverlay />
        </ScrollWrapper>
    )
}
