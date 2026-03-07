
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/admin'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!UUID_REGEX.test(params.id)) {
        return NextResponse.json(
            { error: 'ID inválido' },
            { status: 400 }
        )
    }

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

    // 2. Parse body for image URL
    const body = await request.json()
    const imageUrl = body?.imageUrl as string

    if (!imageUrl) {
        return NextResponse.json({ error: 'imageUrl é obrigatório' }, { status: 400 })
    }

    // 3. Delete via Service Role
    // Remove das tabelas via RPC
    const { error: rpcError } = await supabaseAdmin
        .rpc('delete_image_reference', { p_produto_id: params.id })

    if (rpcError) {
        return NextResponse.json({ error: rpcError.message }, { status: 500 })
    }

    // Deleta arquivo do bucket
    const fileName = imageUrl.split('/').pop()
    if (fileName) {
        const { error: storageError } = await supabaseAdmin
            .storage.from('products').remove([fileName])
        if (storageError) {
            console.warn('[DeleteImage] Storage error:', storageError)
        }
    }

    return NextResponse.json({ success: true })
}
