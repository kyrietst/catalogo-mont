# ARCHITECTURE.md

## 🏗️ Arquitetura do Projeto

**Projeto:** Mont Distribuidora — Catálogo Público  
**Versão:** 1.0.0  
**Data:** 2026-02-08

---

## 📚 Stack Tecnológico

### Frontend
- **Next.js 14.2.35** — App Router (RSC + Server Actions)
- **React 18** — UI library
- **TypeScript 5** — Type safety
- **Tailwind CSS 3** — Utility-first CSS
- **GSAP 3** — Animações premium

### Backend
- **Supabase** — BaaS (PostgreSQL + Auth + Storage)
- **Next.js API Routes** — Endpoints serverless

### State Management
- **Zustand 5** — Cart state (client-side)

### Validation
- **Zod** — Schema validation
- **React Hook Form** — Form handling

### Integração
- **WhatsApp Business API** — Checkout via WhatsApp

---

## 🎯 Decisões Arquiteturais

### 1. Por que Next.js 14 App Router?

**Decisão:** Usar App Router com Server Components

**Justificativa:**
- **SEO:** Páginas públicas precisam de SSR para Google
- **Performance:** RSC reduz bundle JavaScript
- **Simplicidade:** Menos boilerplate que Pages Router
- **Futuro:** App Router é o padrão do Next.js

**Alternativas Consideradas:**
- ❌ Pages Router — Legado, mais complexo
- ❌ Vite + React — Sem SSR nativo

---

### 2. Por que GSAP em vez de Framer Motion?

**Decisão:** GSAP para animações

**Justificativa:**
- **Performance:** GSAP usa GPU acceleration
- **Controle:** Timeline API para sequências complexas
- **Compatibilidade:** Funciona com SSR (Next.js)
- **Premium:** Animações mais sofisticadas (parallax, scroll-trigger)

**Alternativas Consideradas:**
- ❌ Framer Motion — Mais pesado, menos controle fino
- ❌ CSS Animations — Limitado para animações complexas

---

### 3. Por que Zustand em vez de Context API?

**Decisão:** Zustand para cart state

**Justificativa:**
- **Simplicidade:** Menos boilerplate que Context
- **Performance:** Não re-renderiza componentes desnecessariamente
- **DevTools:** Integração com Redux DevTools
- **Persistência:** Middleware para localStorage

**Alternativas Consideradas:**
- ❌ Context API — Re-renders excessivos
- ❌ Redux — Overkill para um carrinho simples

---

### 4. Por que `force-dynamic` em vez de SSG?

**Decisão:** Server-Side Rendering (SSR) com `force-dynamic`

**Justificativa:**
- **Dados dinâmicos:** Produtos mudam frequentemente (preços, estoque)
- **Sem rebuild:** Dados atualizados a cada request
- **Fallback:** Mock data garante resiliência

**Alternativas Consideradas:**
- ❌ SSG (`force-static`) — Requer rebuild para atualizar
- ❌ ISR (`revalidate: 60`) — Delay de até 60s inaceitável

---

### 5. Por que WhatsApp em vez de Checkout Tradicional?

**Decisão:** Checkout via WhatsApp (sem pagamento online)

**Justificativa:**
- **Contexto do negócio:** Distribuidora B2B/B2C com relacionamento pessoal
- **Confiança:** Clientes preferem confirmar por WhatsApp
- **Simplicidade:** Sem necessidade de gateway de pagamento
- **Flexibilidade:** Negociação de preços e condições

**Alternativas Consideradas:**
- ❌ Stripe/Mercado Pago — Overkill para o modelo de negócio
- ❌ Formulário de pedido — Menos pessoal, menos conversão

---

### 6. Por que Schema Híbrido + Views?

**Decisão:** Manter tabelas legadas (PT) e criar novas (prefixo `cat_`) consumidas via Views.

**Justificativa:**
- **Segurança:** O frontend nunca acessa as tabelas do sistema interno diretamente.
- **Estabilidade:** Sem risco de quebrar o sistema legado ao alterar colunas para o site.
- **Padronização:** API do frontend recebe dados em Inglês (`price_cents`, `name`) via Views, independente do nome original no banco (`total`, `nome`).
- **Desacoplamento:** O banco pode mudar internamente, basta ajustar a View.

**Alternativas Consideradas:**
- ❌ Renomear tabelas antigas — Risco altíssimo de quebrar o sistema atual.
- ❌ Duplicar dados — Problema de sincronia (Single Source of Truth violada).

---

## 📁 Estrutura de Pastas

```
catalogo-mont/
├── .docs/                          ← Documentação do projeto
│   ├── ARCHITECTURE.md             ← Este arquivo
│   ├── DATABASE.md                 ← Schema completo do Supabase
│   ├── DATABASE_OWNERSHIP.md       ← Mapa de permissões
│   ├── ROUTES.md                   ← Rotas do Next.js
│   ├── COMPONENTS.md               ← Inventário de componentes
│   ├── ENV.md                      ← Variáveis de ambiente
│   └── CHANGELOG.md                ← Log de mudanças
│
├── src/
│   ├── app/                        ← Next.js App Router
│   │   ├── (public)/               ← Rotas públicas (catálogo)
│   │   │   ├── page.tsx            ← Home
│   │   │   ├── produtos/           ← Catálogo
│   │   │   │   ├── page.tsx        ← Lista de produtos
│   │   │   │   └── [slug]/         ← Produto individual
│   │   │   │       └── page.tsx
│   │   │   └── carrinho/           ← Carrinho
│   │   │       └── page.tsx
│   │   ├── admin/                  ← Rotas admin (Fase 2)
│   │   ├── api/                    ← API Routes
│   │   │   └── pedidos/            ← POST /api/pedidos
│   │   │       └── route.ts
│   │   ├── layout.tsx              ← Root layout
│   │   ├── page.tsx                ← Redirect para /
│   │   └── globals.css             ← Global styles
│   │
│   ├── components/                 ← Componentes React
│   │   ├── ui/                     ← Componentes base (Button, Card, etc)
│   │   ├── catalog/                ← Componentes do catálogo
│   │   ├── shared/                 ← Componentes compartilhados (Navbar, Footer)
│   │   └── admin/                  ← Componentes admin (Fase 2)
│   │
│   ├── lib/                        ← Utilitários e configurações
│   │   ├── supabase/               ← Supabase clients
│   │   │   ├── server.ts           ← Server-side client
│   │   │   └── client.ts           ← Client-side client
│   │   ├── utils/                  ← Funções utilitárias
│   │   │   ├── format.ts           ← Formatação (moeda, peso)
│   │   │   └── cn.ts               ← Class names (clsx + tailwind-merge)
│   │   ├── whatsapp/               ← WhatsApp integration
│   │   │   └── checkout.ts         ← Gerar mensagem de pedido
│   │   └── store/                  ← Zustand stores
│   │       └── cart.ts             ← Cart state
│   │
│   ├── types/                      ← TypeScript types
│   │   ├── database.types.ts       ← Tipos gerados do Supabase
│   │   ├── product.ts              ← Tipos de produto
│   │   └── cart.ts                 ← Tipos de carrinho
│   │
│   └── hooks/                      ← Custom React hooks
│       └── useCart.ts              ← Hook do carrinho (wrapper Zustand)
│
├── public/                         ← Assets estáticos
│   └── images/                     ← Imagens (logos, placeholders)
│
├── .env.local                      ← Variáveis de ambiente (local)
├── .env.local.example              ← Template de variáveis
├── next.config.ts                  ← Configuração Next.js
├── tailwind.config.ts              ← Configuração Tailwind
├── tsconfig.json                   ← Configuração TypeScript
└── package.json                    ← Dependências
```

---

## 🔄 Fluxo de Dados

### Server Components (SSR)

```
User Request
    ↓
Next.js Server
    ↓
createClient() (server-side)
    ↓
Supabase PostgreSQL
    ↓
mapProdutoToProduct() (mapper)
    ↓
Server Component (RSC)
    ↓
HTML Response (SEO-friendly)
```

### Client Components (Carrinho)

```
User Action (Add to Cart)
    ↓
useCartStore() (Zustand)
    ↓
localStorage (persist)
    ↓
Re-render (React)
```

### Checkout (WhatsApp)

```
User Click "Finalizar Pedido"
    ↓
Validação (Zod + React Hook Form)
    ↓
generateWhatsAppMessage() (lib/whatsapp)
    ↓
window.open() (WhatsApp Web/App)
    ↓
Cliente envia mensagem
    ↓
Admin registra venda no Sistema Interno
```

---

## 🎨 Convenções de Código

### Nomenclatura

- **Componentes:** PascalCase (`ProductCard.tsx`)
- **Funções:** camelCase (`formatCurrency()`)
- **Constantes:** UPPER_SNAKE_CASE (`MOCK_PRODUCTS`)
- **Tipos:** PascalCase (`Product`, `CartItem`)
- **Arquivos:** kebab-case para utilitários (`format.ts`)

### Estrutura de Componentes

```tsx
// 1. Imports
import { ... } from '...'

// 2. Types/Interfaces
interface Props { ... }

// 3. Component
export default function Component({ props }: Props) {
    // 3.1. Hooks
    const state = useState()
    
    // 3.2. Handlers
    const handleClick = () => { ... }
    
    // 3.3. Render
    return <div>...</div>
}
```

### Server vs Client Components

**Server Components (padrão):**
- Páginas que buscam dados do Supabase
- Componentes sem interatividade
- SEO-critical content

**Client Components (`'use client'`):**
- Componentes com `useState`, `useEffect`
- Event handlers (`onClick`, `onChange`)
- Animações GSAP (useGSAP hook)
- Zustand stores

---

## 🔐 Segurança

### Supabase RLS

### Supabase RLS & Permissions

- **Catálogo (Anon Key):**
    - `vw_catalogo_produtos`: SELECT (Público)
    - `cat_imagens_produto`: SELECT (Público)
    - `cat_pedidos`: INSERT (Público)
    - **Proibido:** UPDATE/DELETE em qualquer tabela.

- **Sistema Interno (Service Role):**
    - Acesso total a todas as tabelas (`produtos`, `vendas`, `contatos`).
    - Gerencia status dos pedidos via dashboard admin.

### Environment Variables

- **Nunca commitar** `.env.local`
- **Sempre usar** `NEXT_PUBLIC_` para variáveis client-side
- **Service Role Key** apenas em server-side (API Routes/Server Actions)

---

## 🚀 Performance

### Otimizações

1. **Server Components:** Reduz bundle JavaScript
2. **Dynamic Imports:** Lazy loading de componentes pesados
3. **Image Optimization:** `next/image` para imagens
4. **Font Optimization:** `next/font` para Google Fonts
5. **GSAP Context:** Cleanup automático de animações

### Métricas Alvo

- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **Bundle Size:** < 200KB (first load)

---

## 📱 Responsividade

### Breakpoints (Tailwind)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First

Todas as páginas são mobile-first:
- Grid: 1 coluna (mobile) → 2 (tablet) → 3/4 (desktop)
- Navbar: Hamburger menu (mobile) → Full menu (desktop)
- Footer: Stacked (mobile) → Grid (desktop)

---

## 🧪 Testing (Fase 2)

Planejado:
- **Unit:** Vitest + React Testing Library
- **E2E:** Playwright
- **Visual:** Chromatic (Storybook)

---

## 📦 Deployment

### Vercel (Recomendado)

```bash
npm run build
vercel --prod
```

### Environment Variables (Vercel)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_APP_URL`

---

## 🔮 Roadmap (Fase 2)

1. **Sistema Interno (Admin):**
   - Dashboard de vendas
   - Gestão de produtos
   - Gestão de clientes
   - Gestão de estoque

2. **Melhorias no Catálogo:**
   - Busca de produtos
   - Filtros avançados
   - Favoritos
   - Histórico de pedidos

3. **Infraestrutura:**
   - Supabase Storage (imagens de produtos)
   - Supabase Auth (login admin)
   - Testes automatizados
   - CI/CD pipeline
