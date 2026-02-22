
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'

const updateStatusSchema = z.object({
    status: z.enum(['pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado']).optional(),
    status_pagamento: z.enum(['pendente', 'pago', 'parcial']).optional(),
}).refine(data => data.status !== undefined || data.status_pagamento !== undefined, {
    message: 'Informe status ou status_pagamento'
})

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const cookieStore = cookies()

    const authSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            }
        }
    )

    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.user_metadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const result = updateStatusSchema.safeParse(body)

    if (!result.success) {
        return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const patch: Record<string, string> = {}
    if (result.data.status) patch.status = result.data.status
    if (result.data.status_pagamento) patch.status_pagamento = result.data.status_pagamento

    const { data, error } = await supabase
        .from('cat_pedidos')
        .update(patch)
        .eq('id', params.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Integração automática: sincroniza com vendas quando entregue + pago
    if (data.status === 'entregue' && data.status_pagamento === 'pago') {
        const vendaNote = `catalogo:${params.id}`

        // Idempotência: verifica se já foi sincronizado
        const { data: existingVenda } = await supabase
            .from('vendas')
            .select('id')
            .eq('notes', vendaNote)
            .maybeSingle()

        if (!existingVenda) {
            // Busca itens do pedido
            const { data: itens } = await supabase
                .from('cat_itens_pedido')
                .select('produto_id, nome_produto, quantidade, preco_unitario_centavos, total_centavos')
                .eq('pedido_id', params.id)

            // Cria registro em vendas
            const { data: novaVenda, error: vendaError } = await supabase
                .from('vendas')
                .insert({
                    customer_name: data.nome_cliente,
                    customer_phone: data.telefone_cliente,
                    source: 'catalogo',
                    total_cents: data.total_centavos,
                    payment_method: data.metodo_pagamento,
                    payment_status: 'pago',
                    notes: vendaNote,
                    referred_by: data.indicado_por || null,
                })
                .select('id')
                .single()

            // Cria itens da venda
            if (!vendaError && novaVenda && itens?.length) {
                await supabase
                    .from('direct_sale_items')
                    .insert(itens.map(item => ({
                        sale_id: novaVenda.id,
                        product_id: item.produto_id,
                        product_name: item.nome_produto,
                        quantity: item.quantidade,
                        unit_price_cents: item.preco_unitario_centavos,
                        total_cents: item.total_centavos,
                    })))
            }
        }
    }

    return NextResponse.json(data)
}
