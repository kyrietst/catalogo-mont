import type { Product } from '@/types/product'

/**
 * Schema real do banco (tabela produtos)
 */
interface ProdutoDatabase {
    id: string
    nome: string
    codigo: string
    preco: string // numeric (decimal)
    custo: string // numeric (decimal)
    unidade: string
    ativo: boolean
    criado_em: string
    atualizado_em: string
    estoque_atual: number | null
    apelido: string | null
    estoque_minimo: number | null
}

/**
 * Mapeia produto do banco para o type Product usado no frontend
 */
export function mapProdutoToProduct(produto: ProdutoDatabase): Product {
    // Extrai categoria do código (heurística)
    const isCongelado = produto.codigo.includes('congelado') || produto.apelido === 'C' || produto.apelido === 'X' || produto.apelido === 'P'

    // Extrai peso do nome (heurística)
    const weightMatch = produto.nome.match(/(\d+)kg/i)
    const weight_kg = weightMatch ? parseFloat(weightMatch[1]) : 1.0

    // Gera slug a partir do código
    const slug = produto.codigo.replace(/_/g, '-')

    // Converte preço decimal para centavos
    const price_cents = Math.round(parseFloat(produto.preco) * 100)
    const cost_cents = Math.round(parseFloat(produto.custo) * 100)

    // Determina se é destaque (produtos mais vendidos - heurística)
    const is_featured = ['chipa_congelada_2kg', 'palito_queijo_congelado_2kg', 'pao_queijo_congelado_1kg'].includes(produto.codigo)

    return {
        id: produto.id,
        name: produto.nome,
        slug,
        description: null, // Não existe no schema real
        category: isCongelado ? 'congelado' : 'refrigerado',
        weight_kg,
        price_cents,
        cost_cents,
        stock_quantity: produto.estoque_atual || 0,
        stock_min_alert: produto.estoque_minimo || 5,
        is_active: produto.ativo,
        is_featured,
        sort_order: 0, // Não existe no schema real
        created_at: produto.criado_em,
        updated_at: produto.atualizado_em,
        primary_image_url: null,
        images: [],
        stock_status: 'em_estoque',
    }
}

/**
 * Dados mockados como fallback (caso tabela esteja vazia)
 */
export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Chipa Congelada 2kg',
        slug: 'chipa-congelada-2kg',
        description: 'Chipa artesanal congelada, pronta para assar. Receita tradicional paraguaia com queijo de primeira qualidade.',
        category: 'congelado',
        weight_kg: 2.0,
        price_cents: 6000,
        cost_cents: 3300,
        stock_quantity: 20,
        stock_min_alert: 5,
        is_active: true,
        is_featured: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_image_url: null,
        images: [],
        stock_status: 'em_estoque',
    },
    {
        id: '2',
        name: 'Palito de Queijo Congelado 2kg',
        slug: 'palito-queijo-congelado-2kg',
        description: 'Palitos de queijo crocantes, congelados e prontos para fritar. Perfeitos para festas e lanches.',
        category: 'congelado',
        weight_kg: 2.0,
        price_cents: 6000,
        cost_cents: 3300,
        stock_quantity: 15,
        stock_min_alert: 5,
        is_active: true,
        is_featured: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_image_url: null,
        images: [],
        stock_status: 'em_estoque',
    },
    {
        id: '3',
        name: 'Pão de Queijo Congelado 1kg',
        slug: 'pao-queijo-congelado-1kg',
        description: 'Pão de queijo mineiro tradicional, congelado e pronto para assar. Massa leve e saborosa.',
        category: 'congelado',
        weight_kg: 1.0,
        price_cents: 2500,
        cost_cents: 1300,
        stock_quantity: 30,
        stock_min_alert: 5,
        is_active: true,
        is_featured: true,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_image_url: null,
        images: [],
        stock_status: 'em_estoque',
    },
    {
        id: '4',
        name: 'Pão de Queijo Congelado 2kg',
        slug: 'pao-queijo-congelado-2kg',
        description: 'Pão de queijo mineiro tradicional, congelado e pronto para assar. Embalagem econômica.',
        category: 'congelado',
        weight_kg: 2.0,
        price_cents: 5000,
        cost_cents: 2600,
        stock_quantity: 25,
        stock_min_alert: 5,
        is_active: true,
        is_featured: false,
        sort_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_image_url: null,
        images: [],
        stock_status: 'em_estoque',
    },
    {
        id: '5',
        name: 'Massa Pão de Queijo 1kg (Refrigerado)',
        slug: 'massa-pao-queijo-1kg',
        description: 'Massa fresca de pão de queijo refrigerada, pronta para modelar e assar.',
        category: 'refrigerado',
        weight_kg: 1.0,
        price_cents: 2500,
        cost_cents: 1300,
        stock_quantity: 10,
        stock_min_alert: 5,
        is_active: true,
        is_featured: false,
        sort_order: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_image_url: null,
        images: [],
        stock_status: 'em_estoque',
    },
    {
        id: '6',
        name: 'Massa Pão de Queijo 4kg (Refrigerado)',
        slug: 'massa-pao-queijo-4kg',
        description: 'Massa fresca de pão de queijo refrigerada em embalagem econômica.',
        category: 'refrigerado',
        weight_kg: 4.0,
        price_cents: 6500,
        cost_cents: 4100,
        stock_quantity: 8,
        stock_min_alert: 5,
        is_active: true,
        is_featured: false,
        sort_order: 6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_image_url: null,
        images: [],
        stock_status: 'em_estoque',
    },
]
