-- Mont Distribuidora - Seed Products
-- Migration: 002_seed_products.sql
-- Description: Insert initial 6 SKUs with placeholder prices

-- ============================================================================
-- SEED PRODUCTS
-- ============================================================================

INSERT INTO products (name, slug, description, category, weight_kg, price_cents, cost_cents, stock_quantity, is_active, is_featured, sort_order)
VALUES
  -- Congelados
  (
    'Chipa Congelada 2kg',
    'chipa-congelada-2kg',
    'Chipa artesanal congelada, pronta para assar. Receita tradicional paraguaia com queijo de primeira qualidade. Rende aproximadamente 40 unidades.',
    'congelado',
    2.00,
    2800, -- R$ 28,00
    1500, -- R$ 15,00 (custo placeholder)
    20,
    TRUE,
    TRUE,
    1
  ),
  (
    'Palito de Queijo Congelado 2kg',
    'palito-queijo-congelado-2kg',
    'Palitos de queijo crocantes, congelados e prontos para fritar. Perfeitos para festas e lanches. Rende aproximadamente 50 unidades.',
    'congelado',
    2.00,
    3200, -- R$ 32,00
    1800, -- R$ 18,00 (custo placeholder)
    15,
    TRUE,
    TRUE,
    2
  ),
  (
    'Pão de Queijo Congelado 1kg',
    'pao-queijo-congelado-1kg',
    'Pão de queijo mineiro tradicional, congelado e pronto para assar. Massa leve e saborosa. Rende aproximadamente 25 unidades.',
    'congelado',
    1.00,
    1500, -- R$ 15,00
    800,  -- R$ 8,00 (custo placeholder)
    30,
    TRUE,
    TRUE,
    3
  ),
  (
    'Pão de Queijo Congelado 2kg',
    'pao-queijo-congelado-2kg',
    'Pão de queijo mineiro tradicional, congelado e pronto para assar. Embalagem econômica. Rende aproximadamente 50 unidades.',
    'congelado',
    2.00,
    2800, -- R$ 28,00
    1500, -- R$ 15,00 (custo placeholder)
    25,
    TRUE,
    FALSE,
    4
  ),
  
  -- Refrigerados
  (
    'Massa Pão de Queijo 1kg (Refrigerado)',
    'massa-pao-queijo-1kg',
    'Massa fresca de pão de queijo refrigerada, pronta para modelar e assar. Ideal para quem quer fazer pão de queijo fresquinho em casa.',
    'refrigerado',
    1.00,
    1200, -- R$ 12,00
    600,  -- R$ 6,00 (custo placeholder)
    10,
    TRUE,
    FALSE,
    5
  ),
  (
    'Massa Pão de Queijo 4kg (Refrigerado)',
    'massa-pao-queijo-4kg',
    'Massa fresca de pão de queijo refrigerada em embalagem econômica. Perfeita para padarias, lanchonetes e grandes famílias.',
    'refrigerado',
    4.00,
    4500, -- R$ 45,00
    2200, -- R$ 22,00 (custo placeholder)
    8,
    TRUE,
    FALSE,
    6
  );

-- ============================================================================
-- NOTES
-- ============================================================================

-- Imagens: NULL por enquanto (upload manual posterior via Supabase Storage)
-- Preços: valores placeholder em centavos
-- Estoque: quantidades iniciais fictícias
-- is_featured: TRUE para os 3 primeiros (destaque na home)
-- sort_order: ordem de exibição no catálogo
