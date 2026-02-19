import { Navbar, Footer } from '@/components/catalog'
import { createClient } from '@/lib/supabase/server'
import { mapProdutoToProduct, MOCK_PRODUCTS } from '@/lib/supabase/mappers'
import type { Product } from '@/types/product'
import ProductCatalog from './_components/ProductCatalog'
import FeaturedProduct from './_components/FeaturedProduct'
import StoreBanner from './_components/StoreBanner'
import IngredientsSection from './_components/IngredientsSection'
import BenefitsCarousel from './_components/BenefitsCarousel'
import TrustBar from './_components/TrustBar'

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
    title: 'Produtos | Mont Massas',
    description: 'Conhe\u00E7a nossa linha completa de produtos artesanais.',
}

export default async function ProdutosPage() {
    const products = await getAllProducts()

    const featuredProduct = products.find(p => p.is_featured);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-mont-cream pt-16 pb-20">
                <StoreBanner />

                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-8 md:mt-10">
                    {featuredProduct && (
                        <FeaturedProduct product={featuredProduct} />
                    )}

                    <ProductCatalog products={products} />
                </div>

                <IngredientsSection />
                <BenefitsCarousel />
                <TrustBar />
            </main>

            <Footer />
        </>
    )
}
