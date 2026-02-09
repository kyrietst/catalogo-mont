# ROUTES.md

## 🗺️ Mapa Completo de Rotas

---

## 📄 Páginas Públicas (Catálogo)

### 1. Home — `/`

**Arquivo:** `src/app/(public)/page.tsx`  
**Tipo:** Server Component (SSR)  
**Rendering:** `force-dynamic`

**Dados:**
- Busca produtos em destaque do Supabase
- Fallback para `MOCK_PRODUCTS` se Supabase falhar

**Tabelas Supabase:**
- `produtos` (SELECT com `is_featured = true`)

**Seções:**
1. Hero com parallax GSAP
2. Produtos em destaque (grid 2/3/4 colunas)
3. How It Works
4. Brand Story
5. CTA (Call to Action)

---

### 2. Catálogo — `/produtos`

**Arquivo:** `src/app/(public)/produtos/page.tsx`  
**Tipo:** Server Component (SSR)  
**Rendering:** `force-dynamic`

**Dados:**
- Busca todos os produtos ativos do Supabase
- Fallback para `MOCK_PRODUCTS` se Supabase falhar

**Tabelas Supabase:**
- `produtos` (SELECT com `ativo = true`)

**Features:**
- Filtros por categoria (client-side)
- Grid responsivo (2/3/4 colunas)
- Animações GSAP (fade-in, stagger)

---

### 3. Produto Individual — `/produtos/[slug]`

**Arquivo:** `src/app/(public)/produtos/[slug]/page.tsx`  
**Tipo:** Server Component (SSR)  
**Rendering:** `force-dynamic`

**Dados:**
- Busca produto específico por slug
- Busca produtos relacionados (mesma categoria)
- Fallback para `MOCK_PRODUCTS` se Supabase falhar

**Tabelas Supabase:**
- `produtos` (SELECT por slug)

**Features:**
- Galeria de imagens (placeholder)
- Botão "Adicionar ao Carrinho" (client component)
- Produtos relacionados (grid 3 colunas)
- Breadcrumbs

**Metadata:**
- Dynamic `generateMetadata()` para SEO
- Title: `{produto.nome} | Mont Distribuidora`
- Description: `Compre {produto.nome} - {peso} por {preço}`

---

### 4. Carrinho — `/carrinho`

**Arquivo:** `src/app/(public)/carrinho/page.tsx`  
**Tipo:** Client Component (`'use client'`)

**Dados:**
- Zustand store (`useCartStore`)
- localStorage persistence

**Features:**
- Lista de itens no carrinho
- Atualizar quantidade
- Remover item
- Formulário de checkout (Zod + React Hook Form)
- Botão "Finalizar via WhatsApp"

**Validação:**
- Nome (obrigatório)
- Telefone (obrigatório, formato brasileiro)
- Endereço (obrigatório)
- Observações (opcional)

**Ação:**
- Gera mensagem formatada
- Abre WhatsApp Web/App com mensagem pré-preenchida

---

## 🔌 API Routes

### 1. POST `/api/pedidos`

**Arquivo:** `src/app/api/pedidos/route.ts`  
**Método:** `POST`

**Payload:**
```json
{
  "customer": {
    "name": "string",
    "phone": "string",
    "address": "string",
    "notes": "string?"
  },
  "items": [
    {
      "product_id": "uuid",
      "quantity": "number",
      "price_cents": "number"
    }
  ],
  "total_cents": "number"
}
```

**Resposta:**
```json
{
  "success": true,
  "order_id": "uuid",
  "whatsapp_url": "https://wa.me/..."
}
```

**Tabelas Supabase:**
- Nenhuma (Fase 1 — apenas gera WhatsApp URL)
- Fase 2: `vendas`, `itens_venda`

**Autenticação:**
- Nenhuma (público)

**Validação:**
- Zod schema para payload
- Verifica se produtos existem
- Calcula total

---

## 🔒 Páginas Admin (Fase 2)

### 1. Dashboard — `/admin`

**Status:** Placeholder (Fase 2)

**Features Planejadas:**
- Métricas de vendas
- Gráficos de receita
- Alertas de estoque baixo

---

### 2. Produtos — `/admin/produtos`

**Status:** Placeholder (Fase 2)

**Features Planejadas:**
- CRUD de produtos
- Upload de imagens
- Gestão de estoque

---

### 3. Vendas — `/admin/vendas`

**Status:** Placeholder (Fase 2)

**Features Planejadas:**
- Lista de vendas
- Detalhes de venda
- Atualizar status

---

### 4. Clientes — `/admin/clientes`

**Status:** Placeholder (Fase 2)

**Features Planejadas:**
- CRM básico
- Histórico de compras
- Gestão de indicações

---

## 🎨 Layouts

### Root Layout — `src/app/layout.tsx`

**Tipo:** Server Component

**Features:**
- Metadata global (title, description, OG tags)
- Google Fonts (Inter)
- Tailwind CSS global
- HTML lang="pt-BR"

---

### Public Layout — `src/app/(public)/layout.tsx`

**Tipo:** Server Component

**Features:**
- Navbar (sticky)
- Footer
- Main content wrapper

---

## 📊 Resumo de Rotas

| Rota | Tipo | Rendering | Supabase Tables | Features |
|------|------|-----------|-----------------|----------|
| `/` | Server | `force-dynamic` | `produtos` | Hero, Featured Products |
| `/produtos` | Server | `force-dynamic` | `produtos` | Catalog, Filters |
| `/produtos/[slug]` | Server | `force-dynamic` | `produtos` | Product Detail, Related |
| `/carrinho` | Client | CSR | - | Cart, Checkout Form |
| `POST /api/pedidos` | API | - | - | WhatsApp URL Generator |
| `/admin/*` | - | - | - | Placeholder (Fase 2) |

---

## 🔄 Fluxo de Navegação

```
Home (/)
  ↓
Catálogo (/produtos)
  ↓
Produto Individual (/produtos/[slug])
  ↓ [Add to Cart]
Carrinho (/carrinho)
  ↓ [Finalizar Pedido]
WhatsApp (external)
```

---

## 🌐 Redirects

Nenhum redirect configurado ainda.

Planejado para Fase 2:
- `/admin` → `/admin/dashboard` (se não autenticado → `/login`)
