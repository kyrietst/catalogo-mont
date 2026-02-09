'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils/cn'
import { productCardHover } from '@/lib/gsap/animations'

interface ProductCardProps {
    id: string
    name: string
    slug: string
    category: 'congelado' | 'refrigerado'
    weight_kg: number
    price_cents: number
    image_url?: string | null
    is_featured?: boolean
    className?: string
}

export function ProductCard({
    id,
    name,
    slug,
    category,
    weight_kg,
    price_cents,
    image_url,
    is_featured,
    className
}: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (cardRef.current) {
            productCardHover(cardRef.current)
        }
    }, [])

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price_cents / 100)

    return (
        <Link href={`/produtos/${slug}`}>
            <div
                ref={cardRef}
                className={cn(
                    'group relative bg-mont-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300',
                    className
                )}
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-mont-surface">
                    {image_url ? (
                        <Image
                            src={image_url}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-mont-warm-gray">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Badge variant={category} />
                        {is_featured && <Badge variant="destaque" />}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    <h3 className="font-display text-lg sm:text-xl text-mont-espresso line-clamp-2">
                        {name}
                    </h3>

                    <p className="text-sm text-mont-warm-gray font-body">
                        {weight_kg}kg
                    </p>

                    <p className="font-body text-xl sm:text-2xl font-bold text-mont-gold">
                        {formattedPrice}
                    </p>
                </div>
            </div>
        </Link>
    )
}
