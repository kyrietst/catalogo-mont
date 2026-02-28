
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'

// Validation Schema
const updateProductSchema = z.object({
    ativo: z.boolean().optional(),
    visivel_catalogo: z.boolean().optional(),
    descricao: z.string().nullable().optional(),
    categoria: z.string().nullable().optional(),
    peso_kg: z.number().nullable().optional(),
    destaque: z.boolean().optional(),
    slug: z.string().nullable().optional()
})

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const cookieStore = cookies()

    // 1. Verify Auth
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

    // 2. Parse & Validate Body
    const body = await request.json()
    const result = updateProductSchema.safeParse(body)

    if (!result.success) {
        return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // 3. Update Data (Service Role)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
        .from('produtos')
        .update(result.data)
        .eq('id', params.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
