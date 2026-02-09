-- Mont Distribuidora - Initial Schema
-- Migration: 001_initial_schema.sql
-- Description: Complete database schema with all tables, indexes, RLS policies, and triggers

-- ============================================================================
-- TABLES
-- ============================================================================

-- PRODUTOS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('congelado', 'refrigerado')),
  weight_kg DECIMAL(4,2) NOT NULL,
  price_cents INTEGER NOT NULL,
  cost_cents INTEGER,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  stock_min_alert INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IMAGENS DOS PRODUTOS
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PEDIDOS (via catálogo online)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  delivery_method TEXT CHECK (delivery_method IN ('entrega', 'retirada')),
  status TEXT DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'
  )),
  subtotal_cents INTEGER NOT NULL,
  delivery_fee_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('pix', 'dinheiro', 'cartao', 'fiado')),
  payment_status TEXT DEFAULT 'pendente' CHECK (payment_status IN (
    'pendente', 'pago', 'parcial'
  )),
  notes TEXT,
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ITENS DO PEDIDO
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL
);

-- VENDAS DIRETAS (registradas pelo admin, fora do site)
CREATE TABLE direct_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_phone TEXT,
  source TEXT DEFAULT 'boca_a_boca' CHECK (source IN (
    'boca_a_boca', 'upa', 'indicacao', 'whatsapp', 'catalogo', 'marketplace', 'outro'
  )),
  total_cents INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('pix', 'dinheiro', 'cartao', 'fiado')),
  payment_status TEXT DEFAULT 'pago' CHECK (payment_status IN (
    'pago', 'fiado', 'parcial'
  )),
  fiado_due_date DATE,
  notes TEXT,
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ITENS DA VENDA DIRETA
CREATE TABLE direct_sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES direct_sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL
);

-- MOVIMENTAÇÕES DE ESTOQUE
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN (
    'producao', 'venda', 'ajuste', 'perda'
  )),
  quantity INTEGER NOT NULL,
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COBRANÇAS / FIADO
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  original_amount_cents INTEGER NOT NULL,
  paid_amount_cents INTEGER DEFAULT 0,
  remaining_cents INTEGER GENERATED ALWAYS AS (original_amount_cents - paid_amount_cents) STORED,
  status TEXT DEFAULT 'aberto' CHECK (status IN ('aberto', 'parcial', 'quitado')),
  due_date DATE,
  sale_reference UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAGAMENTOS PARCIAIS DO FIADO
CREATE TABLE debt_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id UUID REFERENCES debts(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('pix', 'dinheiro', 'cartao')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTES (CRM básico)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  address TEXT,
  source TEXT DEFAULT 'boca_a_boca',
  total_orders INTEGER DEFAULT 0,
  total_spent_cents INTEGER DEFAULT 0,
  referred_by_customer_id UUID REFERENCES customers(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = TRUE;

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_direct_sales_created ON direct_sales(created_at DESC);
CREATE INDEX idx_direct_sales_source ON direct_sales(source);
CREATE INDEX idx_direct_sales_payment_status ON direct_sales(payment_status);

CREATE INDEX idx_direct_sale_items_sale ON direct_sale_items(sale_id);
CREATE INDEX idx_direct_sale_items_product ON direct_sale_items(product_id);

CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_at DESC);

CREATE INDEX idx_debts_status ON debts(status) WHERE status != 'quitado';
CREATE INDEX idx_debts_due_date ON debts(due_date) WHERE status != 'quitado';
CREATE INDEX idx_debts_customer_phone ON debts(customer_phone);

CREATE INDEX idx_debt_payments_debt ON debt_payments(debt_id);

CREATE INDEX idx_customers_phone ON customers(phone);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_debts_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Products: public read (active only), admin full access
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Product images: public read, admin write
CREATE POLICY "product_images_public_read" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.is_active = TRUE
    )
  );

CREATE POLICY "product_images_admin_all" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Orders: public insert, admin full access
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Order items: public insert, admin read
CREATE POLICY "order_items_public_insert" ON order_items
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Direct sales: admin only
CREATE POLICY "direct_sales_admin" ON direct_sales
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "direct_sale_items_admin" ON direct_sale_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Stock movements: admin only
CREATE POLICY "stock_movements_admin" ON stock_movements
  FOR ALL USING (auth.role() = 'authenticated');

-- Debts: admin only
CREATE POLICY "debts_admin" ON debts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "debt_payments_admin" ON debt_payments
  FOR ALL USING (auth.role() = 'authenticated');

-- Customers: admin only
CREATE POLICY "customers_admin" ON customers
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE products IS 'Catálogo de produtos (pão de queijo, chipa, palito)';
COMMENT ON TABLE product_images IS 'Galeria de imagens dos produtos (Supabase Storage URLs)';
COMMENT ON TABLE orders IS 'Pedidos feitos via catálogo online (WhatsApp checkout)';
COMMENT ON TABLE order_items IS 'Itens individuais de cada pedido';
COMMENT ON TABLE direct_sales IS 'Vendas registradas manualmente pelo admin (boca a boca, UPA, etc)';
COMMENT ON TABLE direct_sale_items IS 'Itens das vendas diretas';
COMMENT ON TABLE stock_movements IS 'Histórico de movimentações de estoque (produção, venda, ajuste, perda)';
COMMENT ON TABLE debts IS 'Controle de fiado (vendas a prazo)';
COMMENT ON TABLE debt_payments IS 'Pagamentos parciais de dívidas';
COMMENT ON TABLE customers IS 'CRM básico de clientes';
