
'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'

interface Product {
    id: string
    nome: string
    preco: number
    ativo: boolean
    categoria: string | null
    descricao: string | null
    peso_kg: number | null
    destaque: boolean
    slug: string | null
}

interface ProductEditFormProps {
    product: Product
    onClose: () => void
    onSave: (id: string, data: Partial<Product>) => Promise<void>
}

export default function ProductEditForm({ product, onClose, onSave }: ProductEditFormProps) {
    const [formData, setFormData] = useState({
        descricao: product.descricao || '',
        categoria: product.categoria || 'congelado',
        peso_kg: product.peso_kg || 0,
        destaque: product.destaque || false,
        slug: product.slug || ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await onSave(product.id, formData)
        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-mont-cream rounded-t-xl">
                    <div>
                        <h3 className="font-serif font-bold text-lg text-mont-espresso">
                            Editar Produto
                        </h3>
                        <p className="text-xs text-mont-gray truncate max-w-[250px]">
                            {product.nome}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X size={20} className="text-mont-espresso" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">

                    {/* Read-only fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-2 rounded border">
                            <span className="block text-[10px] text-gray-500 uppercase">Preço (Sistema)</span>
                            <span className="font-jetbrains font-bold text-mont-espresso">
                                R$ {Number(product.preco).toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded border">
                            <span className="block text-[10px] text-gray-500 uppercase">Status</span>
                            <span className={`font-bold ${product.ativo ? 'text-green-600' : 'text-gray-500'}`}>
                                {product.ativo ? 'ATIVO' : 'INATIVO'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-mont-espresso mb-1">
                            Descrição
                        </label>
                        <textarea
                            value={formData.descricao}
                            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                            rows={3}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mont-gold focus:border-transparent text-sm"
                            placeholder="Descreva o produto..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-mont-espresso mb-1">
                                Categoria (Filtro)
                            </label>
                            <select
                                value={formData.categoria}
                                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mont-gold text-sm"
                            >
                                <option value="congelado">Congelado</option>
                                <option value="refrigerado">Refrigerado</option>
                                <option value="seco">Seco</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-mont-espresso mb-1">
                                Peso (Kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.peso_kg}
                                onChange={e => setFormData({ ...formData, peso_kg: Number(e.target.value) })}
                                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mont-gold text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-mont-espresso mb-1">
                            Slug (URL)
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mont-gold text-sm font-mono text-xs"
                            placeholder="ex: pao-queijo-1kg"
                        />
                    </div>

                    <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <span className="text-sm font-medium text-mont-espresso">
                            Destacar no Catálogo?
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.destaque}
                                onChange={e => setFormData({ ...formData, destaque: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mont-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mont-gold"></div>
                        </label>
                    </div>

                </form>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-mont-espresso text-mont-cream font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    )
}
