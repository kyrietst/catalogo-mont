'use client'

import { useState, useEffect } from 'react'
import { Filter, Search } from 'lucide-react'
import StatusBadge from '../../../../components/admin/StatusBadge'
import OrderCard from '../../../../components/admin/OrderCard'

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
    nome_cliente: string
    telefone_cliente: string
    total_centavos: number
    status: string
    status_pagamento: string
    criado_em: string
    metodo_entrega: string
    metodo_pagamento: string
    cat_itens_pedido: OrderItem[]
    origem?: string
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('todos')
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/pedidos')
            if (res.ok) {
                const data = await res.json()
                setOrders(data)
            }
        } catch (error) {
            console.error('Failed to fetch orders', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        const originalOrders = [...orders]

        setOrders(orders.map(o =>
            o.id === id ? { ...o, status: newStatus } : o
        ))

        try {
            const res = await fetch(`/api/admin/pedidos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) {
                setOrders(originalOrders)
                alert('Erro ao atualizar status')
            }
        } catch (error) {
            setOrders(originalOrders)
            alert('Erro de conexão')
        }
    }

    const handlePaymentStatusChange = async (id: string, newStatus: string) => {
        const originalOrders = [...orders]

        setOrders(orders.map(o =>
            o.id === id ? { ...o, status_pagamento: newStatus } : o
        ))

        try {
            const res = await fetch(`/api/admin/pedidos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_pagamento: newStatus })
            })

            if (!res.ok) {
                setOrders(originalOrders)
                alert('Erro ao atualizar pagamento')
            }
        } catch (error) {
            setOrders(originalOrders)
            alert('Erro de conexão')
        }
    }

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'todos') return true
        if (statusFilter === 'ativos') {
            return ['pendente', 'confirmado', 'preparando', 'enviado'].includes(order.status)
        }
        return order.status === statusFilter
    })

    // Group orders by date (optional, but nice) - keeping simplae list for now per spec

    return (
        <div className="space-y-6 pb-20">
            <div className="sticky top-0 bg-mont-cream z-10 pt-2 pb-4 space-y-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-mont-espresso">
                        Pedidos
                    </h2>
                    <p className="text-mont-gray text-sm">
                        Acompanhe e gerencie os pedidos recebidos.
                    </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['todos', 'ativos', 'pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-mont-espresso text-mont-gold'
                                : 'bg-white text-gray-500 border border-gray-200'
                                }`}
                        >
                            {status === 'todos' ? 'Todos' : status === 'ativos' ? 'Em Andamento' : status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Carregando pedidos...</div>
            ) : (
                <div className="grid gap-3">
                    {filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            items={order.cat_itens_pedido}
                            expanded={expandedOrderId === order.id}
                            onToggleExpand={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            onStatusChange={handleStatusChange}
                            onPaymentStatusChange={handlePaymentStatusChange}
                        />
                    ))}
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            Nenhum pedido encontrado com este filtro.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
