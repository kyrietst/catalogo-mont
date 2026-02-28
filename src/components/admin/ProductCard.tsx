
'use client'

import { useState } from 'react'
import { Edit2, Archive, CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface Product {
    id: string
    nome: string
    preco: number
    ativo: boolean
    visivel_catalogo: boolean
    categoria: string | null
    estoque_status?: string
    descricao: string | null
    peso_kg: number | null
    subtitulo: string | null
    destaque: boolean
    slug: string | null
    anchor_price_cents?: number | null
    preco_ancoragem?: number | null
}

interface ProductCardProps {
    product: Product
    onToggleActive: (id: string, currentStatus: boolean) => Promise<void>
    onEdit: (product: Product) => void
}

export default function ProductCard({ product, onToggleActive, onEdit }: ProductCardProps) {
    const [loading, setLoading] = useState(false)

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setLoading(true)
        await onToggleActive(product.id, product.visivel_catalogo)
        setLoading(false)
    }

    return (
        <div
            onClick={() => onEdit(product)}
            className={`bg-white rounded-lg p-4 border shadow-sm cursor-pointer transition-all active:scale-[0.98] ${!product.ativo ? 'opacity-60 grayscale bg-gray-50' : 'border-gray-100'
                }`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif font-bold text-mont-espresso text-lg leading-tight">
                            {product.nome}
                        </h3>
                        {product.categoria && (
                            <span className="text-[10px] bg-mont-cream px-1.5 py-0.5 rounded text-mont-espresso/70 uppercase font-bold tracking-wider">
                                {product.categoria}
                            </span>
                        )}
                    </div>

                    <div className="font-jetbrains text-mont-gold font-bold">
                        R$ {Number(product.preco).toFixed(2).replace('.', ',')}
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-3">
                    {product.destaque && (
                        <span className="text-mont-gold text-lg leading-none" title="Destaque no catálogo">
                            ★
                        </span>
                    )}
                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className={`p-2 rounded-full transition-colors relative flex-shrink-0 ${product.visivel_catalogo
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : product.visivel_catalogo ? (
                            <CheckCircle size={20} />
                        ) : (
                            <Archive size={20} />
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <Edit2 size={12} />
                    <span>Toque para editar</span>
                </div>
                {/* Estoque status logic could go here if available */}
            </div>
        </div>
    )
}
