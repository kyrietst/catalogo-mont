# PRD — Mont Distribuidora
## Catálogo Digital & E-commerce Premium

**Versão:** 1.0  
**Data:** 23/02/2026  
**Autor:** Kyrie Performance & Resultados  
**Stack:** Next.js 14 (App Router) + Supabase + GSAP + Tailwind CSS  
**Deploy:** Vercel (dev) → VPS KVM2 Hostinger (produção)  
**Domínio:** montdistribuidora.com.br

---

## 1. Visão Geral

### O que é
Plataforma digital da Mont Distribuidora que funciona como catálogo premium + e-commerce com checkout via WhatsApp. O sistema é projetado para ser a **única fonte de verdade** — catálogo público, gestão de pedidos, controle de estoque e relatórios, tudo no mesmo projeto Next.js.

### Por que existe
Eliminar a fragmentação que aconteceu na Adega Anita's (React separado + WordPress + WooCommerce + sync manual). Um único codebase, uma única base de dados, zero duplicação.

### Para quem
- **Cliente final (B2C):** Pessoa física no ABC paulista que compra pão de queijo, chipa e palito de queijo para consumo próprio
- **Comerciante (B2B futuro):** Padarias, lanchonetes, cantinas que compram em maior volume
- **Operador (pai do Gilmar):** Usa o admin pelo celular para gestão completa

### Princípios de Design

**"Apple, não Shopify."**

O catálogo da Mont não deve parecer uma loja genérica. Deve parecer uma **experiência de marca premium** que acontece de vender produtos. A inspiração é clara: Apple.com, Aesop, Dieter Rams — onde o produto é herói, o whitespace respira, e cada animação tem propósito.

- **Produto como protagonista:** Fotos grandes, sem poluição visual, o pão de queijo é o centro de tudo
- **Motion com propósito:** GSAP para parallax, scroll-triggered reveals, transições de página. Nada gratuito — cada animação guia o olhar ou comunica algo
- **Tipografia editorial:** Fontes com personalidade, não Inter/Roboto/Arial. Display font para títulos + body font elegante para texto
- **Whitespace generoso:** Espaço é luxo. Deixar o conteúdo respirar
- **Mobile-first premium:** 90%+ do acesso será celular. A experiência mobile não é "adaptação" — é a principal
- **Zero cara de IA:** Nada de gradientes roxos genéricos, cards com cantos arredondados uniformes, layouts previsíveis

---

## 2. Arquitetura Técnica

### Stack Definitiva

```
Frontend + Backend:  Next.js 14 (App Router)
Banco de dados:      Supabase (PostgreSQL)
Autenticação:        Supabase Auth
Storage de imagens:  Supabase Storage
Animações:           GSAP (ScrollTrigger, ScrollSmoother)
Estilização:         Tailwind CSS (utility-first, sem shadcn)
Pagamento (futuro):  Mercado Pago SDK
Deploy dev:          Vercel (gratuito)
Deploy prod:         VPS KVM2 Hostinger (Node.js + PM2 + Nginx)
```

### Estrutura de Pastas

```
mont-distribuidora/
├── src/
│   ├── app/
│   │   ├── (public)/              # Rotas públicas (catálogo)
│   │   │   ├── page.tsx           # Home — hero + produtos destaque
│   │   │   ├── produtos/
│   │   │   │   ├── page.tsx       # Catálogo completo
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Página do produto individual
│   │   │   ├── sobre/
│   │   │   │   └── page.tsx       # Sobre a Mont (história, diferencial)
│   │   │   └── carrinho/
│   │   │       └── page.tsx       # Carrinho + checkout WhatsApp
│   │   │
│   │   ├── admin/                 # Rotas protegidas (gestão)
│   │   │   ├── layout.tsx         # Layout admin mobile-first
│   │   │   ├── page.tsx           # Dashboard — faturamento resumo
│   │   │   ├── produtos/
│   │   │   │   ├── page.tsx       # CRUD produtos
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Editar produto
│   │   │   ├── vendas/
│   │   │   │   ├── page.tsx       # Registro de vendas
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Detalhe da venda
│   │   │   ├── estoque/
│   │   │   │   └── page.tsx       # Controle de estoque
│   │   │   ├── cobrancas/
│   │   │   │   └── page.tsx       # Gestão de fiado
│   │   │   └── relatorios/
│   │   │       └── page.tsx       # Relatórios de faturamento
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── produtos/
│   │   │   │   └── route.ts       # GET (público) / POST, PUT, DELETE (auth)
│   │   │   ├── pedidos/
│   │   │   │   └── route.ts       # CRUD pedidos
│   │   │   ├── vendas/
│   │   │   │   └── route.ts       # CRUD vendas
│   │   │   ├── estoque/
│   │   │   │   └── route.ts       # Gestão estoque
│   │   │   ├── cobrancas/
│   │   │   │   └── route.ts       # Gestão fiado
│   │   │   ├── upload/
│   │   │   │   └── route.ts       # Upload imagens → Supabase Storage
│   │   │   └── webhook/
│   │   │       └── mercadopago/
│   │   │           └── route.ts   # Webhook MP (futuro)
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Estilos globais + fonts
│   │
│   ├── components/
│   │   ├── ui/                    # Componentes base (CUSTOM, não shadcn)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── catalog/               # Componentes do catálogo público
│   │   │   ├── Hero.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── WhatsAppCheckout.tsx
│   │   │   ├── ParallaxSection.tsx
│   │   │   ├── ScrollReveal.tsx
│   │   │   └── Navbar.tsx
│   │   ├── admin/                 # Componentes do painel admin
│   │   │   ├── AdminNav.tsx
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── SaleForm.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── DebtTracker.tsx
│   │   │   └── RevenueChart.tsx
│   │   └── shared/                # Compartilhados
│   │       ├── Logo.tsx
│   │       ├── Footer.tsx
│   │       └── LoadingScreen.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser client
│   │   │   ├── server.ts          # Server client
│   │   │   └── admin.ts           # Service role (API routes)
│   │   ├── gsap/
│   │   │   └── animations.ts      # Animações reutilizáveis
│   │   ├── cart/
│   │   │   └── store.ts           # Estado do carrinho (zustand ou context)
│   │   ├── whatsapp/
│   │   │   └── checkout.ts        # Gerar mensagem formatada de pedido
│   │   └── utils/
│   │       ├── format.ts          # Formatação de moeda, datas
│   │       └── validators.ts      # Validações de formulário
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   ├── useScrollAnimation.ts
│   │   └── useMediaQuery.ts
│   │
│   └── types/
│       ├── product.ts
│       ├── order.ts
│       ├── sale.ts
│       └── debt.ts
│
├── public/
│   ├── fonts/                     # Fontes locais (performance)
│   └── og/                        # Open Graph images
│
├── supabase/
│   └── migrations/                # SQL migrations
│       ├── 001_products.sql
│       ├── 002_orders.sql
│       ├── 003_sales.sql
│       ├── 004_stock.sql
│       ├── 005_debts.sql
│       └── 006_rls_policies.sql
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Modelo de Dados (Supabase)

```sql
-- PRODUTOS
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category text not null check (category in ('congelado', 'refrigerado')),
  weight_kg decimal(4,2) not null,
  price_cents integer not null,
  cost_cents integer,                          -- custo de produção (admin)
  stock_quantity integer not null default 0,
  stock_min_alert integer default 5,           -- alerta estoque baixo
  is_active boolean default true,
  is_featured boolean default false,           -- destaque na home
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- IMAGENS DOS PRODUTOS
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,                           -- Supabase Storage URL
  alt_text text,
  sort_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- PEDIDOS (via catálogo online)
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number serial,                         -- número sequencial legível
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  delivery_method text check (delivery_method in ('entrega', 'retirada')),
  status text default 'pendente' check (status in (
    'pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'
  )),
  subtotal_cents integer not null,
  delivery_fee_cents integer default 0,
  total_cents integer not null,
  payment_method text check (payment_method in ('pix', 'dinheiro', 'cartao', 'fiado')),
  payment_status text default 'pendente' check (payment_status in (
    'pendente', 'pago', 'parcial'
  )),
  notes text,
  referred_by text,                            -- programa de indicação
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ITENS DO PEDIDO
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,                  -- snapshot do nome
  quantity integer not null,
  unit_price_cents integer not null,           -- snapshot do preço
  total_cents integer not null
);

-- VENDAS DIRETAS (registradas pelo pai, fora do site)
create table direct_sales (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  source text default 'boca_a_boca' check (source in (
    'boca_a_boca', 'upa', 'indicacao', 'whatsapp', 'catalogo', 'marketplace', 'outro'
  )),
  total_cents integer not null,
  payment_method text check (payment_method in ('pix', 'dinheiro', 'cartao', 'fiado')),
  payment_status text default 'pago' check (payment_status in (
    'pago', 'fiado', 'parcial'
  )),
  fiado_due_date date,                         -- vencimento do fiado
  notes text,
  referred_by text,
  created_at timestamptz default now()
);

-- ITENS DA VENDA DIRETA
create table direct_sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references direct_sales(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity integer not null,
  unit_price_cents integer not null,
  total_cents integer not null
);

-- MOVIMENTAÇÕES DE ESTOQUE
create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  movement_type text not null check (movement_type in (
    'producao', 'venda', 'ajuste', 'perda'
  )),
  quantity integer not null,                   -- positivo = entrada, negativo = saída
  reference_id uuid,                           -- id do pedido ou venda que gerou
  notes text,
  created_at timestamptz default now()
);

-- COBRANÇAS / FIADO
create table debts (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  original_amount_cents integer not null,
  paid_amount_cents integer default 0,
  remaining_cents integer generated always as (original_amount_cents - paid_amount_cents) stored,
  status text default 'aberto' check (status in ('aberto', 'parcial', 'quitado')),
  due_date date,
  sale_reference uuid,                         -- referência à venda
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PAGAMENTOS PARCIAIS DO FIADO
create table debt_payments (
  id uuid primary key default gen_random_uuid(),
  debt_id uuid references debts(id) on delete cascade,
  amount_cents integer not null,
  payment_method text check (payment_method in ('pix', 'dinheiro', 'cartao')),
  notes text,
  created_at timestamptz default now()
);

-- CLIENTES (CRM básico)
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique not null,
  address text,
  source text default 'boca_a_boca',
  total_orders integer default 0,
  total_spent_cents integer default 0,
  referred_by_customer_id uuid references customers(id),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES
create index idx_products_active on products(is_active) where is_active = true;
create index idx_products_slug on products(slug);
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);
create index idx_direct_sales_created on direct_sales(created_at desc);
create index idx_debts_status on debts(status) where status != 'quitado';
create index idx_customers_phone on customers(phone);

-- RLS (Row Level Security)
alter table products enable row level security;
alter table orders enable row level security;
alter table direct_sales enable row level security;
alter table debts enable row level security;
alter table customers enable row level security;

-- Produtos: leitura pública (ativos), escrita apenas autenticado
create policy "products_public_read" on products
  for select using (is_active = true);
create policy "products_admin_all" on products
  for all using (auth.role() = 'authenticated');

-- Pedidos: criação pública, leitura/update apenas autenticado
create policy "orders_public_insert" on orders
  for insert with check (true);
create policy "orders_admin_all" on orders
  for all using (auth.role() = 'authenticated');

-- Vendas, dívidas, clientes: apenas autenticado
create policy "direct_sales_admin" on direct_sales
  for all using (auth.role() = 'authenticated');
create policy "debts_admin" on debts
  for all using (auth.role() = 'authenticated');
create policy "customers_admin" on customers
  for all using (auth.role() = 'authenticated');
```

---

## 3. Design System — "Mont Premium"

### Filosofia

A Mont vende um produto artesanal, caseiro, com alma. O design precisa transmitir **autenticidade premium** — não é fast food, não é industrial. É comida feita com cuidado, por uma família, para famílias.

### Paleta de Cores

```css
:root {
  /* Primárias */
  --mont-cream:      #FAF7F2;     /* Background principal — tom de massa, acolhedor */
  --mont-espresso:   #2C1810;     /* Texto principal — marrom profundo, quente */
  --mont-gold:       #C8963E;     /* Accent — dourado queijo, premium */
  --mont-gold-light: #E8C876;     /* Accent hover */

  /* Neutras */
  --mont-warm-gray:  #8B7E74;     /* Texto secundário */
  --mont-line:       #E5DDD4;     /* Bordas, divisórias */
  --mont-surface:    #F5F0E8;     /* Cards, superfícies elevadas */
  --mont-white:      #FFFDF9;     /* Branco quente */

  /* Funcionais */
  --mont-success:    #5B8C5A;     /* Verde — estoque ok, pago */
  --mont-warning:    #D4A039;     /* Amarelo — fiado pendente */
  --mont-danger:     #C44536;     /* Vermelho — estoque baixo, vencido */

  /* Overlay */
  --mont-overlay:    rgba(44, 24, 16, 0.6);  /* Para modais */
}
```

**Por que esses tons?** A paleta é inspirada no próprio produto: o creme da massa, o dourado do queijo derretido, o marrom da crosta assada. Isso cria coesão instintiva entre marca e produto. Nada de azul corporativo ou roxo tech.

### Tipografia

```css
/* Display — para títulos e hero */
@font-face {
  font-family: 'Playfair Display';
  /* Serifada, editorial, premium. Transmite tradição e sofisticação */
}

/* Body — para texto corrido e UI */
@font-face {
  font-family: 'DM Sans';
  /* Sans-serif moderna, geométrica, altamente legível em mobile */
}

/* Monospace — para preços e números */
@font-face {
  font-family: 'JetBrains Mono';
  /* Para preços no admin. Opcional no catálogo */
}

/* Escala tipográfica */
--text-hero:    clamp(2.5rem, 8vw, 5rem);     /* Hero principal */
--text-display: clamp(2rem, 5vw, 3.5rem);     /* Títulos de seção */
--text-heading: clamp(1.5rem, 3vw, 2rem);     /* Subtítulos */
--text-subhead: clamp(1.125rem, 2vw, 1.375rem);
--text-body:    1rem;                           /* 16px base */
--text-small:   0.875rem;
--text-caption:  0.75rem;
```

### Componentes Visuais Chave

**Cards de produto:** Nada de borda arredondada genérica. Imagem full-bleed no topo, texto com espaço generoso embaixo. Hover: imagem faz zoom sutil (scale 1.03) com GSAP, preço aparece com fade-in.

**Botões:** Dois estilos — primário (fundo dourado `--mont-gold`, texto espresso, hover com brilho sutil) e secundário (outline espresso, hover preenche). Cantos levemente arredondados (8px), não pill-shape.

**Navegação:** Transparente sobre o hero, transição para fundo cream com blur no scroll. Logo à esquerda, carrinho à direita com badge de quantidade. Menu hamburger em mobile com animação de morphing (três linhas → X).

---

## 4. Páginas & Funcionalidades

### 4.1 HOME — A Experiência

**Objetivo:** Impressionar, posicionar a marca, e levar para os produtos.

**Seção 1 — Hero (viewport inteiro)**
- Imagem de pão de queijo em destaque (fotografia real, não stock)
- Parallax: imagem se move em velocidade diferente do texto ao scrollar
- Título com Playfair Display grande: "Pão de queijo artesanal. Feito com alma."
- Subtítulo DM Sans: "Massas naturais congeladas e refrigeradas direto pra sua casa"
- CTA: "Ver produtos" com scroll suave para seção de produtos
- Animação de entrada: texto revela palavra por palavra (GSAP SplitText feel)

**Seção 2 — Produtos em Destaque (scroll-triggered)**
- 3-4 produtos featured com reveal animation ao scrollar
- Layout assimétrico: produto principal maior à esquerda, dois menores empilhados à direita
- Hover: zoom sutil na imagem + shadow elevation
- Click: navega para página do produto com page transition
- Badge "Mais vendido" ou "Novo" quando aplicável

**Seção 3 — Como Funciona (3 steps com parallax)**
- "Escolha" → "Peça" → "Receba"
- Ícones custom (não Lucide genérico), animados com GSAP no scroll
- Fundo com leve mudança de tom (cream → surface)

**Seção 4 — A Mont (brand story)**
- Pequeno texto sobre a história familiar
- Foto real (quando disponível) ou textura artesanal
- "Feito em família, entregue com carinho na região do ABC"

**Seção 5 — CTA Final**
- "Pronto pra experimentar?" + botão WhatsApp + botão catálogo
- Parallax com imagem de produto ao fundo

**Footer**
- Logo, contato, WhatsApp, Instagram (quando ativo)
- Horários de atendimento
- Regiões de entrega

### 4.2 CATÁLOGO (/produtos)

**Objetivo:** Navegação clara e rápida dos produtos com possibilidade de adicionar ao carrinho.

- Filtro por categoria: "Todos", "Congelados", "Refrigerados" — tabs com animação de underline
- Grid responsivo: 2 colunas mobile, 3 tablet, 4 desktop
- Cards com imagem, nome, peso, preço, botão "Adicionar"
- Animação de entrada: stagger reveal dos cards ao carregar
- Scroll infinito ou paginação (depende da quantidade — 6 SKUs iniciais não precisa)
- Busca (futuro, quando catálogo crescer)

### 4.3 PÁGINA DO PRODUTO (/produtos/[slug])

**Objetivo:** Vender o produto com informação completa e visual premium.

- Gallery de imagens com swipe (mobile) e thumbnails
- Nome, peso, preço grande e visível
- Descrição do produto
- Categoria (congelado/refrigerado) com badge visual
- Instruções de preparo (para congelados: tempo de forno, temperatura)
- Seletor de quantidade + botão "Adicionar ao carrinho" (fixo no bottom em mobile)
- Seção "Você também pode gostar" com produtos relacionados
- Transição de página com GSAP (imagem do card "cresce" para a posição da gallery)

### 4.4 CARRINHO (/carrinho)

**Objetivo:** Revisão do pedido e envio via WhatsApp ou pagamento via Mercado Pago.

**O carrinho pode funcionar como drawer lateral (desktop) ou página full (mobile).**

- Lista de itens com imagem, nome, quantidade editável, preço, remover
- Subtotal atualizado em tempo real
- Informações de entrega: nome, telefone, endereço (se entrega), método (entrega/retirada)
- Taxa de entrega (se aplicável)
- Campo "Indicado por" (programa de indicação)
- Campo de observações
- Resumo do pedido com total

**Checkout WhatsApp (v1):**
- Botão "Enviar pedido pelo WhatsApp"
- Gera mensagem formatada automática com todos os itens, quantidades, preços e total
- Abre WhatsApp com a mensagem pré-preenchida para o número da Mont
- Formato da mensagem:

```
🧀 *Novo Pedido — Mont Distribuidora*

*Cliente:* João Silva
*Telefone:* (11) 99999-9999
*Entrega:* Rua Exemplo, 123 — SBC

━━━━━━━━━━━━━━━━

*Itens:*
▸ Pão de Queijo Congelado 1kg × 2 — R$ 30,00
▸ Chipa Congelada 2kg × 1 — R$ 28,00
▸ Massa Pão de Queijo 4kg × 1 — R$ 45,00

━━━━━━━━━━━━━━━━

*Subtotal:* R$ 103,00
*Entrega:* R$ 8,00
*Total:* R$ 111,00

*Indicado por:* Maria (UPA)
*Obs:* Entregar após 18h

Pedido feito pelo site montdistribuidora.com.br
```

**Checkout Mercado Pago (v1.1 — quando integrar):**
- Botão "Pagar online" ao lado do WhatsApp
- Cria preferência de pagamento via API do Mercado Pago
- Redirect para checkout Mercado Pago (não precisa de checkout transparente no v1)
- Webhook recebe confirmação e atualiza status do pedido
- Notificação via WhatsApp Business API (futuro) ou manual

### 4.5 ADMIN (/admin) — Mobile-First

**Acesso:** Login simples via Supabase Auth (email/senha do pai)

**Dashboard**
- Faturamento do dia, semana, mês — cards grandes e legíveis no celular
- Gráfico simples de faturamento dos últimos 7/30 dias
- Pedidos pendentes (vindos do site)
- Alertas: estoque baixo, fiado vencido
- Acesso rápido: "Nova venda", "Ver produtos", "Cobranças"

**Gestão de Produtos**
- Lista de produtos com foto, nome, preço, estoque
- Criar/editar produto: nome, slug, descrição, categoria, peso, preço, custo, estoque
- Upload múltiplo de fotos → Supabase Storage (com compressão client-side)
- Ativar/desativar produto (soft delete)
- Reordenar (drag-and-drop ou campo sort_order)
- **PONTO CHAVE:** cadastrou aqui, aparece automaticamente no catálogo público. Zero duplicação.

**Registro de Vendas Diretas**
- Para vendas feitas fora do site (boca a boca, UPA, etc.)
- Formulário rápido: seleciona produtos, quantidade, cliente (nome + telefone), forma de pagamento
- Se pagamento = fiado, preenche data de vencimento
- Desconta do estoque automaticamente

**Controle de Estoque**
- Visão de todos os produtos com quantidade atual
- Alertas visuais: vermelho se abaixo do mínimo
- Registrar entrada de produção (lote produzido)
- Histórico de movimentações

**Gestão de Cobranças (Fiado)**
- Lista de dívidas abertas com nome, valor, vencimento, status
- Filtro: todas, vencidas, a vencer
- Registrar pagamento parcial ou total
- Botão "Cobrar via WhatsApp" — gera mensagem de cobrança amigável
- Mensagem modelo:

```
Oi [nome]! Tudo bem? 😊
Passando pra lembrar que temos um valor em aberto
de R$ [valor] referente ao pedido de [data].
Quando puder resolver, me avisa! 🙏
Pix: [chave] | Pode ser dinheiro também.
Obrigado! — Mont Distribuidora 🧀
```

**Relatórios**
- Faturamento por período (dia, semana, mês, custom)
- Faturamento por produto (qual vende mais)
- Faturamento por canal (boca a boca vs. site vs. marketplace)
- Ticket médio
- Total de fiado em aberto
- Clientes mais frequentes

---

## 5. Animações GSAP — Guia de Implementação

### Princípios

- Cada animação tem **propósito**: guiar o olhar, criar hierarquia, ou transmitir qualidade
- Performance: usar `will-change`, `transform` e `opacity` (propriedades GPU-accelerated)
- Mobile: reduzir complexidade de animação em telas < 768px
- Respeitar `prefers-reduced-motion`: desativar animações para acessibilidade

### Catálogo de Animações

```typescript
// lib/gsap/animations.ts

// 1. HERO — Reveal do texto palavra por palavra
export const heroTextReveal = (element: HTMLElement) => {
  gsap.from(element.querySelectorAll('.word'), {
    y: 120,
    opacity: 0,
    rotateX: -80,
    stagger: 0.08,
    duration: 1.2,
    ease: 'power4.out',
  });
};

// 2. PARALLAX — Imagem se move mais devagar que o conteúdo
export const parallaxImage = (element: HTMLElement, speed: number = 0.5) => {
  gsap.to(element, {
    yPercent: -20 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// 3. SCROLL REVEAL — Elementos aparecem ao entrar no viewport
export const scrollReveal = (elements: HTMLElement[], stagger: number = 0.1) => {
  gsap.from(elements, {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
};

// 4. PRODUCT CARD HOVER — Zoom sutil na imagem
export const productCardHover = (card: HTMLElement) => {
  const img = card.querySelector('img');
  const tl = gsap.timeline({ paused: true });
  tl.to(img, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
  card.addEventListener('mouseenter', () => tl.play());
  card.addEventListener('mouseleave', () => tl.reverse());
};

// 5. SECTION TRANSITION — Fundo muda de cor suavemente no scroll
export const sectionColorTransition = (section: HTMLElement, toColor: string) => {
  gsap.to(section, {
    backgroundColor: toColor,
    scrollTrigger: {
      trigger: section,
      start: 'top 60%',
      end: 'top 20%',
      scrub: true,
    },
  });
};

// 6. COUNTER — Números de faturamento animam até o valor (admin)
export const animateCounter = (element: HTMLElement, endValue: number) => {
  gsap.from(element, {
    textContent: 0,
    duration: 1.5,
    ease: 'power2.out',
    snap: { textContent: 1 },
    onUpdate: function() {
      element.textContent = formatCurrency(Number(element.textContent));
    }
  });
};

// 7. CART ADD — Feedback visual ao adicionar produto
export const cartAddFeedback = (button: HTMLElement, cartIcon: HTMLElement) => {
  const tl = gsap.timeline();
  tl.to(button, { scale: 0.95, duration: 0.1 })
    .to(button, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' })
    .fromTo(cartIcon, { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1 }, '-=0.1');
};

// 8. PAGE TRANSITION — Smooth transition entre páginas
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};
```

---

## 6. Fluxo do WhatsApp Checkout

```
[Cliente navega catálogo]
         ↓
[Adiciona produtos ao carrinho]
         ↓
[Vai para /carrinho]
         ↓
[Preenche: nome, telefone, endereço, método entrega]
         ↓
[Clica "Enviar pedido pelo WhatsApp"]
         ↓
[Sistema gera mensagem formatada]
         ↓
[Abre api.whatsapp.com/send?phone=XXXX&text=MENSAGEM]
         ↓
[Cliente envia mensagem no WhatsApp]
         ↓
[Pai recebe e confirma]
         ↓
[Pedido salvo no Supabase com status "pendente"]
         ↓
[Pai muda status no admin conforme evolui]
```

**Ponto importante:** O pedido é salvo no banco ANTES de abrir o WhatsApp. Mesmo que o cliente não envie a mensagem, o pedido fica registrado como "pendente" para follow-up.

---

## 7. Mercado Pago — Integração Futura (v1.1)

### Escopo Mínimo

A integração mais simples e eficaz é o **Checkout Pro** (redirect). Não precisa de checkout transparente no v1.

```
[Cliente finaliza carrinho]
         ↓
[Clica "Pagar online"]
         ↓
[API route /api/checkout cria preferência no Mercado Pago]
         ↓
[Cliente é redirecionado para checkout.mercadopago.com.br]
         ↓
[Paga via Pix, cartão, boleto]
         ↓
[Mercado Pago chama webhook /api/webhook/mercadopago]
         ↓
[Sistema atualiza status do pedido para "pago"]
         ↓
[Pai recebe notificação no admin]
```

### Complexidade estimada
- Criar conta Mercado Pago PJ: 1h
- Implementar API route de criação de preferência: 2-3h
- Implementar webhook de confirmação: 2h
- Testar com sandbox: 1-2h
- **Total: ~1 dia de trabalho.** Não é difícil.

---

## 8. SEO & Performance

### SEO
- Metadata dinâmica por produto (título, descrição, og:image)
- Sitemap.xml gerado automaticamente
- Schema.org Product markup para cada produto
- URLs amigáveis: `/produtos/pao-de-queijo-congelado-1kg`
- Open Graph configurado para compartilhamento no WhatsApp/Instagram

### Performance
- Imagens: next/image com otimização automática + lazy loading
- Fontes: carregamento local (não Google Fonts CDN) com font-display: swap
- GSAP: importação dinâmica para não bloquear renderização inicial
- ISR (Incremental Static Regeneration): páginas de produto revalidam a cada 60s
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 9. Fases de Implementação

### FASE 1 — Catálogo + Carrinho WhatsApp (Semana 1-2)
- Setup do projeto Next.js + Supabase + GSAP
- Design system base (cores, tipografia, componentes)
- Home page com hero + produtos destaque
- Página de catálogo com grid de produtos
- Página individual do produto
- Carrinho com checkout WhatsApp
- Deploy na Vercel
- **Entregável:** catálogo funcional online

### FASE 2 — Admin Mobile (Semana 3-4)
- Autenticação admin
- Dashboard com faturamento
- CRUD de produtos com upload de imagens
- Registro de vendas diretas
- Controle básico de estoque
- **Entregável:** pai consegue gerenciar tudo pelo celular

### FASE 3 — Cobranças + Relatórios (Semana 5-6)
- Gestão de fiado com cobrança via WhatsApp
- Relatórios de faturamento por período/produto/canal
- Alertas de estoque baixo
- CRM básico de clientes
- **Entregável:** gestão financeira completa

### FASE 4 — Mercado Pago + Refinamentos (Semana 7-8)
- Integração Mercado Pago (Checkout Pro)
- Webhook de confirmação
- Refinamento de animações
- Testes de performance e SEO
- Migração para VPS Hostinger
- Domínio montdistribuidora.com.br configurado
- **Entregável:** e-commerce completo com pagamento online

---

## 10. Métricas de Sucesso

| Métrica | Meta Fase 1 | Meta 3 meses |
|---------|-------------|--------------|
| Pedidos pelo site/mês | 10 | 50+ |
| % vendas via catálogo vs. boca a boca | 10% | 30% |
| Ticket médio | R$30 | R$45+ (kits) |
| Tempo de cadastro de produto | — | < 3 min |
| Fiado em aberto | R$3.000 | < R$1.500 |
| Faturamento mensal | R$12.000 | R$20.000+ |

---

*Documento interno — Kyrie Performance & Resultados*
*Mont Distribuidora — Fevereiro 2026*
