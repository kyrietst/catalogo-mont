import { Navbar, Footer } from '@/components/catalog'
import { createClient } from '@/lib/supabase/server'
import { mapProdutoToProduct, MOCK_PRODUCTS } from '@/lib/supabase/mappers'
import type { Product } from '@/types/product'
import HeroSection from './_components/HeroSection'
import FeaturedProducts from './_components/FeaturedProducts'
import HowItWorks from './_components/HowItWorks'
import BrandStory from './_components/BrandStory'
import FinalCTA from './_components/FinalCTA'
import HomeWrapper from './_components/HomeWrapper'

// Force dynamic rendering (não SSG)
export const dynamic = 'force-dynamic'

async function getFeaturedProducts(): Promise<Product[]> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('vw_catalogo_produtos')
            .select('*')
            .eq('is_active', true)
            .eq('is_featured', true)
            .limit(10)

        if (error || !data || data.length === 0) {
            console.log('Usando produtos mockados (fallback)')
            return MOCK_PRODUCTS.filter(p => p.is_featured)
        }

        return data as Product[]

    } catch (error) {
        console.error('Erro ao buscar produtos:', error)
        return MOCK_PRODUCTS.filter(p => p.is_featured)
    }
}

export default async function HomePage() {
    const featuredProducts = await getFeaturedProducts()

    return (
        <>
            <Navbar />

            <HomeWrapper>
                <HeroSection />
                <FeaturedProducts products={featuredProducts} />
                <HowItWorks />
                <BrandStory />
                <FinalCTA />
            </HomeWrapper>

            <Footer />
        </>
    )
}
