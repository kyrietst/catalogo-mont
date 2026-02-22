'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart/store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Navbar, Footer } from '@/components/catalog'
import { Button, Input } from '@/components/ui'
import { formatCurrency, formatPhone, unformatPhone, isValidPhone } from '@/lib/utils/format'
import { generateWhatsAppMessage, generateWhatsAppUrl } from '@/lib/whatsapp/checkout'
import { useCep } from '@/hooks/useCep'
import Link from 'next/link'

const DELIVERY_FEE_CENTS = 800 // R$ 8,00

const checkoutSchema = z.object({
    customer_name: z.string().min(3, 'Nome muito curto'),
    customer_phone: z.string().refine(isValidPhone, 'Telefone inválido'),
    delivery_method: z.enum(['entrega', 'retirada']),
    payment_method: z.enum(['pix', 'dinheiro']),
    // Campos de endereço — montados em customer_address no onSubmit
    cep: z.string().optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    referred_by: z.string().optional(),
    notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return digits
}

export default function CarrinhoPage() {
    const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [phoneValue, setPhoneValue] = useState('')
    const [cepDisplayValue, setCepDisplayValue] = useState('')

    const { fetchCep, loading: loadingCep } = useCep()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setFocus,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            delivery_method: 'entrega',
            payment_method: 'pix',
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',
        },
    })

    const deliveryMethod = watch('delivery_method')
    const cepValue = watch('cep')
    const subtotalCents = getTotalPrice()
    const deliveryFeeCents = deliveryMethod === 'entrega' ? DELIVERY_FEE_CENTS : 0
    const totalCents = subtotalCents + deliveryFeeCents

    // Dispara busca ao completar 8 dígitos — mesmo padrão do ContatoFormModal.tsx
    useEffect(() => {
        if (cepValue && cepValue.replace(/\D/g, '').length === 8) {
            fetchCep(cepValue).then((data) => {
                if (data) {
                    setValue('logradouro', data.street)
                    setValue('bairro', data.neighborhood)
                    setValue('cidade', data.city)
                    setValue('uf', data.state)
                    setTimeout(() => setFocus('numero'), 100)
                }
            })
        }
    }, [cepValue]) // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = async (data: CheckoutFormData) => {
        setIsSubmitting(true)

        try {
            // Monta customer_address a partir dos campos individuais
            let customer_address: string | undefined
            if (data.delivery_method === 'entrega') {
                const parts: string[] = []
                if (data.logradouro) {
                    parts.push(`${data.logradouro}, ${data.numero || 'S/N'}`)
                }
                if (data.complemento) parts.push(data.complemento)
                if (data.bairro) parts.push(data.bairro)
                if (data.cidade && data.uf) parts.push(`${data.cidade}/${data.uf}`)
                const cepClean = (data.cep || '').replace(/\D/g, '')
                if (cepClean) parts.push(cepClean)
                customer_address = parts.join(' - ')
            }

            const orderPayload = {
                customer_name: data.customer_name,
                customer_phone: unformatPhone(data.customer_phone),
                customer_address,
                delivery_method: data.delivery_method,
                payment_method: data.payment_method,
                items: items.map(item => ({
                    product_id: item.product.id,
                    product_name: item.product.name,
                    quantity: item.quantity,
                    unit_price_cents: item.product.price_cents,
                })),
                subtotal_cents: subtotalCents,
                delivery_fee_cents: deliveryFeeCents,
                total_cents: totalCents,
                referred_by: data.referred_by,
                notes: data.notes,
            }

            // Salva pedido no Supabase
            const response = await fetch('/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            })

            if (!response.ok) {
                throw new Error('Erro ao salvar pedido')
            }

            // Gera mensagem WhatsApp (usa customer_address montado)
            const message = generateWhatsAppMessage(
                { ...data, customer_address: customer_address || '' },
                items,
                subtotalCents,
                deliveryFeeCents,
                totalCents
            )

            const whatsappUrl = generateWhatsAppUrl(message)
            window.open(whatsappUrl, '_blank')
            clearCart()

        } catch (error) {
            console.error('Erro ao finalizar pedido:', error)
            alert('Erro ao finalizar pedido. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Estado vazio
    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-mont-cream py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto text-center py-20">
                            <svg className="w-24 h-24 mx-auto mb-6 text-mont-gray/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>

                            <h1 className="font-display text-4xl text-mont-espresso mb-4">
                                Seu carrinho está vazio
                            </h1>

                            <p className="text-mont-gray text-lg mb-8">
                                Adicione produtos ao carrinho para continuar
                            </p>

                            <Link href="/produtos">
                                <Button variant="primary" size="lg">
                                    Ver Produtos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-mont-cream py-20">
                <div className="container mx-auto px-4">
                    <h1 className="font-display text-4xl md:text-5xl text-mont-espresso mb-12 text-center">
                        Finalizar Pedido
                    </h1>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de Itens */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="font-display text-2xl text-mont-espresso mb-4">
                                Seus Itens
                            </h2>

                            {items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="bg-mont-white p-4 rounded-lg shadow-sm flex gap-4"
                                >
                                    <div className="w-20 h-20 bg-mont-surface rounded flex-shrink-0">
                                        {item.product.image_url ? (
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-mont-gray/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-medium text-mont-espresso mb-1">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-mont-gray text-sm mb-2">
                                            {formatCurrency(item.product.price_cents)} cada
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-8 h-8 bg-mont-surface rounded flex items-center justify-center text-mont-espresso hover:bg-mont-gray/10"
                                            >
                                                −
                                            </button>

                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1
                                                    updateQuantity(item.product.id, val)
                                                }}
                                                className="w-16 text-center bg-mont-surface rounded py-1 text-mont-espresso"
                                                min="1"
                                            />

                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-8 h-8 bg-mont-surface rounded flex items-center justify-center text-mont-espresso hover:bg-mont-gray/10"
                                            >
                                                +
                                            </button>

                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="ml-auto text-mont-gray hover:text-red-600 transition-colors"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-medium text-mont-espresso">
                                            {formatCurrency(item.product.price_cents * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Formulário + Resumo */}
                        <div className="space-y-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="bg-mont-white p-6 rounded-lg shadow-sm space-y-4">
                                <h2 className="font-display text-2xl text-mont-espresso mb-4">
                                    Dados de Entrega
                                </h2>

                                <Input
                                    label="Nome completo"
                                    {...register('customer_name')}
                                    error={errors.customer_name?.message}
                                />

                                <Input
                                    label="Telefone"
                                    type="tel"
                                    value={phoneValue}
                                    {...register('customer_phone', {
                                        onChange: (e) => {
                                            const formatted = formatPhone(e.target.value)
                                            setPhoneValue(formatted)
                                        },
                                    })}
                                    error={errors.customer_phone?.message}
                                    placeholder="(11) 99999-9999"
                                />

                                <div>
                                    <label className="block text-mont-gray text-sm mb-2">
                                        Método de entrega
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="entrega"
                                                {...register('delivery_method')}
                                                className="text-mont-gold"
                                            />
                                            <span className="text-mont-espresso">
                                                Entrega (+{formatCurrency(DELIVERY_FEE_CENTS)})
                                            </span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="retirada"
                                                {...register('delivery_method')}
                                                className="text-mont-gold"
                                            />
                                            <span className="text-mont-espresso">
                                                Retirada no local
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-mont-gray text-sm mb-2">
                                        Forma de pagamento
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'pix', label: 'PIX' },
                                            { id: 'dinheiro', label: 'Dinheiro' }
                                        ].map(option => (
                                            <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={option.id}
                                                    {...register('payment_method')}
                                                    className="text-mont-gold"
                                                />
                                                <span className="text-mont-espresso">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {deliveryMethod === 'entrega' && (
                                    <div className="space-y-3">
                                        {/* CEP com máscara e spinner */}
                                        <div className="relative">
                                            <Input
                                                label="CEP"
                                                maxLength={9}
                                                value={cepDisplayValue}
                                                {...register('cep', {
                                                    onChange: (e) => {
                                                        const masked = formatCep(e.target.value)
                                                        setCepDisplayValue(masked)
                                                        setValue('cep', masked)
                                                    },
                                                })}
                                                placeholder="00000-000"
                                            />
                                            {loadingCep && (
                                                <div className="absolute right-3 top-[42px]">
                                                    <Loader2 className="h-4 w-4 animate-spin text-mont-gold" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Logradouro — somente leitura, preenchido pelo CEP */}
                                        <Input
                                            label="Logradouro"
                                            readOnly
                                            {...register('logradouro')}
                                            className="bg-mont-surface cursor-not-allowed opacity-75"
                                            placeholder="Preenchido automaticamente"
                                        />

                                        {/* Número (foco automático após busca) + Complemento */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Número"
                                                {...register('numero')}
                                                placeholder="Ex: 123"
                                            />
                                            <Input
                                                label="Complemento"
                                                {...register('complemento')}
                                                placeholder="Apto, bloco..."
                                            />
                                        </div>

                                        {/* Bairro — somente leitura, preenchido pelo CEP */}
                                        <Input
                                            label="Bairro"
                                            readOnly
                                            {...register('bairro')}
                                            className="bg-mont-surface cursor-not-allowed opacity-75"
                                            placeholder="Preenchido automaticamente"
                                        />

                                        {/* Cidade + UF — somente leitura, preenchidos pelo CEP */}
                                        <div className="grid grid-cols-[1fr_80px] gap-3">
                                            <Input
                                                label="Cidade"
                                                readOnly
                                                {...register('cidade')}
                                                className="bg-mont-surface cursor-not-allowed opacity-75"
                                                placeholder="Preenchida automaticamente"
                                            />
                                            <Input
                                                label="UF"
                                                readOnly
                                                {...register('uf')}
                                                className="bg-mont-surface cursor-not-allowed opacity-75 text-center"
                                                placeholder="—"
                                            />
                                        </div>
                                    </div>
                                )}

                                <Input
                                    label="Indicado por (opcional)"
                                    {...register('referred_by')}
                                    placeholder="Nome de quem indicou"
                                />

                                <div>
                                    <label className="block text-mont-gray text-sm mb-2">
                                        Observações (opcional)
                                    </label>
                                    <textarea
                                        {...register('notes')}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-mont-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-mont-gold"
                                        placeholder="Alguma observação sobre o pedido?"
                                    />
                                </div>

                                {/* Resumo */}
                                <div className="border-t border-mont-surface pt-4 space-y-2">
                                    <div className="flex justify-between text-mont-gray">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(subtotalCents)}</span>
                                    </div>

                                    {deliveryFeeCents > 0 && (
                                        <div className="flex justify-between text-mont-gray">
                                            <span>Entrega</span>
                                            <span>{formatCurrency(deliveryFeeCents)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-xl font-bold text-mont-espresso pt-2 border-t border-mont-surface">
                                        <span>Total</span>
                                        <span className="text-mont-gold">{formatCurrency(totalCents)}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={isSubmitting}
                                    className="w-full"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Enviar pelo WhatsApp
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}
