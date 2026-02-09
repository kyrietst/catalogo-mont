'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart/store'
import { Button } from '@/components/ui'
import type { Product } from '@/types/product'
import { useRouter } from 'next/navigation'

interface AddToCartSectionProps {
    product: Product
    compact?: boolean
}

export default function AddToCartSection({ product, compact = false }: AddToCartSectionProps) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const { addItem } = useCartStore()
    const router = useRouter()

    const handleAddToCart = () => {
        setIsAdding(true)
        addItem(product, quantity)

        // Feedback visual
        setTimeout(() => {
            setIsAdding(false)
            router.push('/carrinho')
        }, 300)
    }

    const incrementQuantity = () => {
        setQuantity(prev => Math.min(prev + 1, 99))
    }

    const decrementQuantity = () => {
        setQuantity(prev => Math.max(prev - 1, 1))
    }

    if (compact) {
        return (
            <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center bg-mont-surface rounded-lg">
                    <button
                        onClick={decrementQuantity}
                        className="px-3 py-2 text-mont-espresso hover:bg-mont-gray/10 transition-colors"
                        aria-label="Diminuir quantidade"
                    >
                        −
                    </button>

                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 1
                            setQuantity(Math.max(1, Math.min(val, 99)))
                        }}
                        className="w-12 text-center bg-transparent text-mont-espresso font-medium"
                        min="1"
                        max="99"
                    />

                    <button
                        onClick={incrementQuantity}
                        className="px-3 py-2 text-mont-espresso hover:bg-mont-gray/10 transition-colors"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>
                </div>

                {/* Add Button */}
                <Button
                    variant="primary"
                    size="md"
                    onClick={handleAddToCart}
                    isLoading={isAdding}
                    className="flex-1"
                >
                    Adicionar ao Carrinho
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-mont-gray text-sm mb-2">
                    Quantidade
                </label>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-mont-surface rounded-lg">
                        <button
                            onClick={decrementQuantity}
                            className="px-4 py-3 text-mont-espresso hover:bg-mont-gray/10 transition-colors"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1
                                setQuantity(Math.max(1, Math.min(val, 99)))
                            }}
                            className="w-16 text-center bg-transparent text-mont-espresso font-medium text-lg"
                            min="1"
                            max="99"
                        />

                        <button
                            onClick={incrementQuantity}
                            className="px-4 py-3 text-mont-espresso hover:bg-mont-gray/10 transition-colors"
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAdding}
                className="w-full"
            >
                Adicionar ao Carrinho
            </Button>
        </div>
    )
}
