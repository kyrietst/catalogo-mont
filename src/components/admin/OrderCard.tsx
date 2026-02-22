
'use client'

import { ChevronDown, ChevronUp, Package, Phone, User, Monitor, Store } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface OrderItem {
    id: string
    quantidade: number
    preco_unitario: number
    total_centavos: number
    produto: {
        nome: string
    }
}

interface Order {
    id: string
    numero_pedido: number
    cliente_nome: string
    cliente_telefone: string
    total_centavos: number
    status: string
    status_pagamento: string
    criado_em: string
    metodo_entrega: string
    metodo_pagamento: string
    origem?: string // 'online' or 'balcao' (inferred)
}

interface OrderCardProps {
    order: Order
    items?: OrderItem[]
    expanded: boolean
    onToggleExpand: () => void
    onStatusChange: (id: string, newStatus: string) => Promise<void>
    onPaymentStatusChange: (id: string, newStatus: string) => Promise<void>
}

export default function OrderCard({
    order,
    items,
    expanded,
    onToggleExpand,
    onStatusChange,
    onPaymentStatusChange
}: OrderCardProps) {

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(val / 100)
    }

    return (
        <div className={`bg-white rounded-lg border transition-all ${expanded ? 'shadow-md border-mont-gold/50' : 'shadow-sm border-gray-200'}`}>

            {/* Header Summary */}
            <div
                onClick={onToggleExpand}
                className="p-4 cursor-pointer"
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <span className="font-jetbrains font-bold text-mont-espresso">
                            #{order.numero_pedido}
                        </span>
                        <StatusBadge status={order.status} />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        {formatDate(order.criado_em)}
                    </span>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <User size={14} className="text-gray-400" />
                            {order.cliente_nome}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            {order.metodo_entrega === 'entrega' ? <Package size={12} /> : <Store size={12} />}
                            <span className="capitalize">{order.metodo_entrega}</span>
                            <span className="text-gray-300">|</span>
                            <span>{order.metodo_pagamento}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-jetbrains font-bold text-lg text-mont-gold">
                            {formatCurrency(order.total_centavos)}
                        </span>
                        {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4">

                    {/* Actions */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        <a
                            href={`tel:${order.cliente_telefone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200"
                        >
                            <Phone size={14} />
                            Ligar
                        </a>

                        {/* Status Select */}
                        <select
                            value={order.status}
                            onChange={(e) => onStatusChange(order.id, e.target.value)}
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-mont-gold outline-none"
                        >
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="preparando">Preparando</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelado</option>
                        </select>

                        {/* Pagamento Select */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 font-medium">Pagamento</span>
                            <select
                                value={order.status_pagamento}
                                onChange={(e) => onPaymentStatusChange(order.id, e.target.value)}
                                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-mont-gold outline-none"
                            >
                                <option value="pendente">Pendente</option>
                                <option value="pago">Pago</option>
                                <option value="parcial">Parcial</option>
                            </select>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Itens do Pedido</h4>
                        {items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-mont-espresso bg-white w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-xs">
                                        {item.quantidade}x
                                    </span>
                                    <span className="text-gray-700 line-clamp-1">
                                        {item.produto?.nome || 'Produto Indefinido'}
                                    </span>
                                </div>
                                <div className="font-jetbrains text-gray-600 text-xs">
                                    {formatCurrency(item.total_centavos)}
                                </div>
                            </div>
                        )) || <p className="text-xs text-gray-400 italic">Carregando itens...</p>}
                    </div>

                </div>
            )}
        </div>
    )
}
