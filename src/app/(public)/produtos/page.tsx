import { Navbar, Footer } from '@/components/catalog'
import { createClient } from '@/lib/supabase/server'
import { mapProdutoToProduct, MOCK_PRODUCTS } from '@/lib/supabase/mappers'
import type { Product } from '@/types/product'
import ProductCatalog from './_components/ProductCatalog'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getAllProducts(): Promise<Product[]> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('vw_catalogo_produtos')
            .select('*')
            .eq('is_active', true)
            // .order('sort_order', { ascending: true }) // Se a view tiver sort_order
            .order('name', { ascending: true }) // Fallback seguro

        if (error || !data || data.length === 0) {
            console.log('Usando produtos mockados (fallback)')
            return MOCK_PRODUCTS
        }

        return data as Product[]

    } catch (error) {
        console.error('Erro ao buscar produtos:', error)
        return MOCK_PRODUCTS
    }
}

export const metadata = {
    title: 'Catálogo de Produtos | Mont Distribuidora',
    description: 'Confira nosso catálogo completo de massas congeladas e refrigeradas. Pão de queijo, chipa e palitos de queijo artesanais.',
}

export default async function ProdutosPage() {
    const products = await getAllProducts()

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-mont-cream py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl md:text-6xl text-mont-espresso mb-4">
                            Nossos Produtos
                        </h1>
                        <p className="text-mont-gray text-lg max-w-2xl mx-auto">
                            Massas artesanais congeladas e refrigeradas, feitas com ingredientes naturais
                        </p>
                    </div>

                    <ProductCatalog products={products} />
                </div>
            </main>

            <Footer />
        </>
    )
}
