import { Navbar, Footer } from '@/components/catalog'
import { createClient } from '@/lib/supabase/server'
import { mapProdutoToProduct, MOCK_PRODUCTS } from '@/lib/supabase/mappers'
import { formatCurrency, formatWeight } from '@/lib/utils/format'
import { Badge } from '@/components/ui'
import type { Product } from '@/types/product'
import AddToCartSection from './_components/AddToCartSection'
import RelatedProducts from './_components/RelatedProducts'
import { notFound } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getProduct(slug: string): Promise<Product | null> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('vw_catalogo_produtos')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error || !data) {
            const mockProduct = MOCK_PRODUCTS.find(p => p.slug === slug)
            return mockProduct || null
        }

        return data as Product

    } catch (error) {
        console.error('Erro ao buscar produto:', error)
        const mockProduct = MOCK_PRODUCTS.find(p => p.slug === slug)
        return mockProduct || null
    }
}



async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('vw_catalogo_produtos')
            .select('*')
            .eq('is_active', true)
            .eq('category', category)
            .neq('id', currentId)
            .limit(3)

        if (error || !data) {
            return MOCK_PRODUCTS
                .filter(p => p.category === category && p.id !== currentId)
                .slice(0, 3)
        }

        return data as Product[]

    } catch (error) {
        console.error('Erro ao buscar produtos relacionados:', error)
        return MOCK_PRODUCTS
            .filter(p => p.category === category && p.id !== currentId)
            .slice(0, 3)
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug)

    if (!product) {
        return {
            title: 'Produto não encontrado | Mont Distribuidora',
        }
    }

    return {
        title: `${product.name} | Mont Distribuidora`,
        description: product.description || `Compre ${product.name} - ${formatWeight(product.weight_kg)} por ${formatCurrency(product.price_cents)}`,
    }
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product.category, product.id)

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-mont-cream py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Grid: Imagem + Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                            {/* Imagem */}
                            <div className="aspect-square bg-mont-surface rounded-lg overflow-hidden">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-32 h-32 text-mont-gray/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <div className="mb-4">
                                    <Badge variant={product.category} />
                                </div>

                                <h1 className="font-display text-4xl md:text-5xl text-mont-espresso mb-4">
                                    {product.name}
                                </h1>

                                <p className="text-mont-gray text-lg mb-6">
                                    {formatWeight(product.weight_kg)}
                                </p>

                                <div className="text-4xl font-bold text-mont-gold mb-8">
                                    {formatCurrency(product.price_cents)}
                                </div>

                                {product.description && (
                                    <div className="mb-8">
                                        <h2 className="font-display text-2xl text-mont-espresso mb-3">
                                            Sobre o produto
                                        </h2>
                                        <p className="text-mont-gray leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                )}

                                {product.category === 'congelado' && (
                                    <div className="bg-mont-surface p-6 rounded-lg mb-8">
                                        <h3 className="font-display text-xl text-mont-espresso mb-3">
                                            ❄️ Instruções de Preparo
                                        </h3>
                                        <ul className="text-mont-gray space-y-2">
                                            <li>• Pré-aqueça o forno a 180°C</li>
                                            <li>• Não é necessário descongelar</li>
                                            <li>• Asse por 20-25 minutos até dourar</li>
                                            <li>• Sirva quente</li>
                                        </ul>
                                    </div>
                                )}

                                {/* Desktop: AddToCart inline */}
                                <div className="hidden lg:block">
                                    <AddToCartSection product={product} />
                                </div>
                            </div>
                        </div>

                        {/* Produtos Relacionados */}
                        {relatedProducts.length > 0 && (
                            <RelatedProducts products={relatedProducts} />
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile: AddToCart fixo no bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-mont-white border-t border-mont-surface p-4 shadow-lg z-50">
                <AddToCartSection product={product} compact />
            </div>

            <Footer />
        </>
    )
}
