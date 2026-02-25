import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// Validação do payload
const orderSchema = z.object({
    customer_name: z.string().min(3),
    customer_phone: z.string().min(10),
    customer_address: z.string().optional(),
    delivery_method: z.enum(['entrega', 'retirada']),
    payment_method: z.enum(['pix', 'dinheiro']),
    items: z.array(z.object({
        product_id: z.string().uuid(),
        product_name: z.string(),
        quantity: z.number().int().positive(),
        unit_price_cents: z.number().int().positive(),
    })).min(1),
    subtotal_cents: z.number().int(),
    delivery_fee_cents: z.number().int(),
    total_cents: z.number().int(),
    referred_by: z.string().optional(),
    notes: z.string().optional(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Valida payload
        const validatedData = orderSchema.parse(body)

        // Cria cliente Supabase com service role (bypass RLS)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // Tenta inserir pedido (Tabelas Reais)
        try {
            console.log('Iniciando inserção do pedido no banco de dados...')

            // 1. Inserir em cat_pedidos
            const { data: pedido, error: pedidoError } = await supabase
                .from('cat_pedidos')
                .insert({
                    nome_cliente: validatedData.customer_name,
                    telefone_cliente: validatedData.customer_phone,
                    endereco_entrega: validatedData.customer_address || null,
                    metodo_entrega: validatedData.delivery_method,
                    subtotal_centavos: validatedData.subtotal_cents,
                    frete_centavos: validatedData.delivery_fee_cents,
                    total_centavos: validatedData.total_cents,
                    metodo_pagamento: validatedData.payment_method,
                    observacoes: validatedData.notes || null,
                    indicado_por: validatedData.referred_by || null,
                    status: 'pendente',
                    status_pagamento: 'pendente'
                })
                .select()
                .single()

            if (pedidoError) {
                console.error('Erro ao inserir pedido em cat_pedidos:', pedidoError)
                throw pedidoError
            }

            console.log('Pedido criado com sucesso:', pedido.id)

            // 2. Inserir em cat_itens_pedido
            const itensPedido = validatedData.items.map(item => ({
                pedido_id: pedido.id,
                produto_id: item.product_id,
                nome_produto: item.product_name,
                quantidade: item.quantity,
                preco_unitario_centavos: item.unit_price_cents,
                total_centavos: item.unit_price_cents * item.quantity,
            }))

            const { error: itensError } = await supabase
                .from('cat_itens_pedido')
                .insert(itensPedido)

            if (itensError) {
                console.error('Erro ao inserir itens em cat_itens_pedido:', itensError)
                // Idealmente faria rollback, mas Supabase via API não tem transação simples aqui.
                // Vamos apenas logar por enquanto.
                throw itensError
            }

            // --- INÍCIO DA SINCRONIZAÇÃO COM VENDAS ---
            try {
                // 1. Get or create contato pelo telefone
                let contatoId: string | null = null

                const { data: contatoExistente, error: contatoError } = await supabase
                    .from('contatos')
                    .select('id')
                    .eq('telefone', validatedData.customer_phone)
                    .maybeSingle()

                if (contatoExistente) {
                    contatoId = contatoExistente.id
                } else {
                    const { data: novoContato, error: contatoCreateError } = await supabase
                        .from('contatos')
                        .insert({
                            nome: validatedData.customer_name,
                            telefone: validatedData.customer_phone,
                            tipo: 'catalogo',
                            origem: 'catalogo',
                            status: 'cliente'
                        })
                        .select('id')
                        .single()

                    if (!contatoCreateError && novoContato) {
                        contatoId = novoContato.id
                    } else {
                        console.error('SYNC: Erro ao criar contato:', contatoCreateError)
                    }
                }

                // 2. Inserir em vendas
                const { error: vendaError } = await supabase
                    .from('vendas')
                    .insert({
                        origem: 'catalogo',
                        status: 'pendente',
                        total: validatedData.total_cents / 100,
                        forma_pagamento: validatedData.payment_method,
                        pago: false,
                        valor_pago: 0,
                        taxa_entrega: validatedData.delivery_fee_cents / 100,
                        observacoes: validatedData.notes || null,
                        cat_pedido_id: pedido.id,
                        data: new Date().toISOString().split('T')[0],
                        contato_id: contatoId,
                    })

                if (vendaError) {
                    console.error('SYNC: Erro ao sincronizar com vendas:', vendaError)
                } else {
                    console.log('SYNC: Pedido sincronizado com vendas com sucesso')
                }
            } catch (syncError) {
                console.error('SYNC: Falha crítica na sincronização:', syncError)
                // Não interrompemos o retorno do pedido se a sincronização falhar
            }
            // --- FIM DA SINCRONIZAÇÃO ---

            return NextResponse.json({
                pedido_id: pedido.id,
                numero_pedido: pedido.numero_pedido,
                status: 'pendente',
                message: 'Pedido criado com sucesso'
            })

        } catch (dbError) {
            console.error('Erro crítico no banco de dados:', dbError)

            // Retorna erro 500 real, sem fallback
            return NextResponse.json(
                { error: 'Erro ao salvar pedido no banco de dados' },
                { status: 500 }
            )
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Erro ao processar pedido:', error)
        return NextResponse.json(
            { error: 'Erro ao processar pedido' },
            { status: 500 }
        )
    }
}
