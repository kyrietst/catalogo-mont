# TODO — Mont Distribuidora FASE 1
## Catálogo Digital + Checkout WhatsApp

**Projeto:** Next.js 14 (App Router) + Supabase + GSAP + Tailwind CSS  
**Objetivo:** Catálogo premium funcional com checkout via WhatsApp  
**Prazo:** Semanas 1-2  
**Deploy:** Vercel (dev)

---

## 🎯 ENTREGÁVEIS FASE 1

- [x] Catálogo online navegável
- [ ] Checkout via WhatsApp funcional
- [ ] Design system "Apple, não Shopify" implementado
- [ ] Animações GSAP premium
- [ ] Deploy na Vercel

---

## 📋 CHECKLIST TÉCNICA

### 1. SETUP INICIAL DO PROJETO

#### 1.1 Inicializar Next.js 14
```bash
npx create-next-app@latest mont-distribuidora --typescript --tailwind --app --no-src
cd mont-distribuidora
```

**Configurações durante setup:**
- [x] TypeScript: ✅ Yes
- [x] ESLint: ✅ Yes
- [x] Tailwind CSS: ✅ Yes
- [x] App Router: ✅ Yes
- [x] Import alias (@/*): ✅ Yes
- [x] src/ directory: ❌ No (usar estrutura raiz)

**Verificação:**
```bash
npm run dev
# → Deve abrir http://localhost:3000 com página padrão Next.js
```

---

#### 1.2 Instalar Dependências Core

```bash
# Supabase
npm install @supabase/supabase-js @supabase/ssr

# GSAP (animações premium)
npm install gsap

# Gerenciamento de estado (carrinho)
npm install zustand

# Utilitários
npm install clsx tailwind-merge
npm install date-fns

# Validação de formulários
npm install zod react-hook-form @hookform/resolvers

# Ícones
npm install lucide-react

# Dev dependencies
npm install -D @types/node
```

**Verificação:**
- [x] package.json contém todas as dependências
- [x] `npm install` roda sem erros
- [x] `npm run dev` ainda funciona

---

#### 1.3 Configurar Estrutura de Pastas

Criar estrutura conforme PRD:

```bash
# Criar pastas principais
mkdir -p app/(public)/produtos/[slug]
mkdir -p app/(public)/sobre
mkdir -p app/(public)/carrinho
mkdir -p app/admin/{produtos,vendas,estoque,cobrancas,relatorios}
mkdir -p app/api/{produtos,pedidos,vendas,estoque,cobrancas,upload,webhook/mercadopago}
mkdir -p components/{ui,catalog,admin,shared}
mkdir -p lib/{supabase,gsap,cart,whatsapp,utils}
mkdir -p hooks
mkdir -p types
mkdir -p public/{fonts,og}
mkdir -p supabase/migrations
```

**Checklist de pastas criadas:**
- [x] `app/(public)/` — rotas públicas
- [x] `app/admin/` — rotas protegidas
- [x] `app/api/` — API routes
- [x] `components/{ui,catalog,admin,shared}` — componentes organizados
- [x] `lib/` — utilitários e configurações
- [x] `hooks/` — custom hooks
- [x] `types/` — TypeScript types
- [x] `public/fonts/` — fontes locais
- [x] `supabase/migrations/` — SQL migrations

---

### 2. CONFIGURAÇÃO DO SUPABASE

#### 2.1 Criar Projeto no Supabase

- [ ] Acessar [supabase.com](https://supabase.com)
- [ ] Criar novo projeto: "mont-distribuidora"
- [ ] Região: South America (São Paulo)
- [ ] Anotar credenciais:
  - [ ] Project URL
  - [ ] Project API Key (anon/public)
  - [ ] Service Role Key (apenas para API routes)

---

#### 2.2 Configurar Variáveis de Ambiente

Criar `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Checklist:**
- [x] `.env.local` criado (template .env.local.example)
- [ ] Variáveis preenchidas com valores reais (aguardando configuração Supabase)
- [x] `.env.local` adicionado ao `.gitignore`

---

#### 2.3 Criar Clientes Supabase

**Arquivo:** `lib/supabase/client.ts`
```typescript
// Browser client (client components)
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

**Arquivo:** `lib/supabase/server.ts`
```typescript
// Server client (server components, server actions)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

**Arquivo:** `lib/supabase/admin.ts`
```typescript
// Admin client (API routes com service role)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

**Checklist:**
- [x] `lib/supabase/client.ts` criado
- [x] `lib/supabase/server.ts` criado
- [x] `lib/supabase/admin.ts` criado
- [x] Imports funcionando sem erros TypeScript

---

#### 2.4 Executar Migrations do Banco de Dados

**Criar arquivo:** `supabase/migrations/001_initial_schema.sql`

Copiar schema completo do PRD (linhas 189-374):
- [ ] Tabela `products`
- [ ] Tabela `product_images`
- [ ] Tabela `orders`
- [ ] Tabela `order_items`
- [ ] Tabela `direct_sales`
- [ ] Tabela `direct_sale_items`
- [ ] Tabela `stock_movements`
- [ ] Tabela `debts`
- [ ] Tabela `debt_payments`
- [ ] Tabela `customers`
- [ ] Indexes criados
- [ ] RLS (Row Level Security) habilitado
- [ ] Policies configuradas

**Executar migration:**

Opção 1 — Via Supabase CLI:
```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref [PROJECT_ID]

# Executar migration
supabase db push
```

Opção 2 — Via Dashboard:
- [ ] Copiar SQL do arquivo `001_initial_schema.sql`
- [ ] Colar no SQL Editor do Supabase Dashboard
- [ ] Executar query

**Verificação:**
- [ ] Todas as tabelas criadas
- [ ] RLS habilitado
- [ ] Policies ativas
- [ ] Testar query: `SELECT * FROM products;` retorna vazio (sem erro)

---

#### 2.5 Configurar Supabase Storage (Imagens)

No Supabase Dashboard:

1. **Criar bucket:**
   - [ ] Nome: `product-images`
   - [ ] Public: ✅ Yes
   - [ ] File size limit: 5MB
   - [ ] Allowed MIME types: `image/jpeg, image/png, image/webp`

2. **Configurar policies do bucket:**

```sql
-- Policy: Leitura pública
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Upload apenas autenticado
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Delete apenas autenticado
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

**Checklist:**
- [ ] Bucket `product-images` criado
- [ ] Bucket configurado como público
- [ ] Policies de leitura/escrita configuradas
- [ ] Testar upload manual de imagem no dashboard

---

### 3. DESIGN SYSTEM — "Mont Premium"

#### 3.1 Configurar Tailwind CSS

**Arquivo:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mont: {
          cream: '#FAF7F2',
          espresso: '#2C1810',
          gold: '#C8963E',
          'gold-light': '#E8C876',
          'warm-gray': '#8B7E74',
          line: '#E5DDD4',
          surface: '#F5F0E8',
          white: '#FFFDF9',
          success: '#5B8C5A',
          warning: '#D4A039',
          danger: '#C44536',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(2.5rem, 8vw, 5rem)',
        display: 'clamp(2rem, 5vw, 3.5rem)',
        heading: 'clamp(1.5rem, 3vw, 2rem)',
        subhead: 'clamp(1.125rem, 2vw, 1.375rem)',
      },
    },
  },
  plugins: [],
}
export default config
```

**Checklist:**
- [x] Cores `mont.*` configuradas
- [x] Fontes configuradas (variáveis CSS)
- [x] Escala tipográfica responsiva

---

#### 3.2 Configurar Fontes Locais

**Baixar fontes:**
- [ ] [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) → `public/fonts/playfair/`
- [ ] [DM Sans](https://fonts.google.com/specimen/DM+Sans) → `public/fonts/dm-sans/`
- [ ] [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) → `public/fonts/jetbrains/`

**Arquivo:** `app/layout.tsx`

```typescript
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="font-body bg-mont-cream text-mont-espresso antialiased">
        {children}
      </body>
    </html>
  )
}
```

**Checklist:**
- [x] Fontes configuradas via next/font/google (otimização automática)
- [x] Variáveis CSS configuradas
- [x] `font-display: swap` para performance
- [x] Fontes aplicadas no body

---

#### 3.3 Estilos Globais

**Arquivo:** `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Cores (já no Tailwind, mas útil para CSS puro) */
    --mont-cream: #FAF7F2;
    --mont-espresso: #2C1810;
    --mont-gold: #C8963E;
    --mont-gold-light: #E8C876;
    --mont-warm-gray: #8B7E74;
    --mont-line: #E5DDD4;
    --mont-surface: #F5F0E8;
    --mont-white: #FFFDF9;
    --mont-success: #5B8C5A;
    --mont-warning: #D4A039;
    --mont-danger: #C44536;
    --mont-overlay: rgba(44, 24, 16, 0.6);
  }

  * {
    @apply border-mont-line;
  }

  body {
    @apply bg-mont-cream text-mont-espresso;
  }

  /* Smooth scroll */
  html {
    scroll-behavior: smooth;
  }

  /* Acessibilidade: respeitar prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer utilities {
  /* Whitespace generoso (princípio de design) */
  .section-padding {
    @apply px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32;
  }

  /* Container responsivo */
  .container-mont {
    @apply max-w-7xl mx-auto px-6 md:px-12 lg:px-24;
  }
}
```

**Checklist:**
- [x] Variáveis CSS definidas
- [x] Reset de estilos aplicado
- [x] Smooth scroll habilitado
- [x] `prefers-reduced-motion` respeitado
- [x] Utilities customizadas criadas

---

### 4. COMPONENTES BASE (UI)

Criar componentes reutilizáveis CUSTOM (não shadcn).

#### 4.1 Button Component

**Arquivo:** `components/ui/Button.tsx`

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-mont-gold focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-mont-gold text-mont-espresso hover:bg-mont-gold-light': variant === 'primary',
            'border-2 border-mont-espresso text-mont-espresso hover:bg-mont-espresso hover:text-mont-cream':
              variant === 'secondary',
            'text-mont-espresso hover:bg-mont-surface': variant === 'ghost',
            // Sizes
            'px-4 py-2 text-sm rounded-lg': size === 'sm',
            'px-6 py-3 text-base rounded-lg': size === 'md',
            'px-8 py-4 text-lg rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

**Checklist:**
- [ ] Variantes: primary, secondary, ghost
- [ ] Tamanhos: sm, md, lg
- [ ] Estado de loading
- [ ] Acessibilidade (focus ring)
- [ ] Disabled state

---

#### 4.2 Input Component

**Arquivo:** `components/ui/Input.tsx`

```typescript
import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-mont-espresso mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 rounded-lg border-2 transition-colors',
            'bg-mont-white text-mont-espresso placeholder:text-mont-warm-gray',
            'focus:outline-none focus:ring-2 focus:ring-mont-gold focus:border-transparent',
            {
              'border-mont-line': !error,
              'border-mont-danger': error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-mont-danger">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-mont-warm-gray">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

**Checklist:**
- [ ] Label opcional
- [ ] Error state com mensagem
- [ ] Helper text
- [ ] Focus ring
- [ ] Estilos Mont Premium

---

#### 4.3 Outros Componentes UI

Criar estrutura básica (implementação detalhada na Fase 4):

- [ ] `components/ui/Modal.tsx` — Modal com overlay
- [ ] `components/ui/Toast.tsx` — Notificações
- [ ] `components/ui/Skeleton.tsx` — Loading states
- [ ] `components/ui/Badge.tsx` — Tags (Novo, Mais vendido)
- [ ] `components/ui/Card.tsx` — Container genérico

---

### 5. TYPES \u0026 UTILITIES

#### 5.1 TypeScript Types

**Arquivo:** `types/product.ts`

```typescript
export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category: 'congelado' | 'refrigerado'
  weight_kg: number
  price_cents: number
  cost_cents: number | null
  stock_quantity: number
  stock_min_alert: number
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductWithImages extends Product {
  images: ProductImage[]
}
```

**Arquivo:** `types/order.ts`

```typescript
export interface Order {
  id: string
  order_number: number
  customer_name: string
  customer_phone: string
  customer_address: string | null
  delivery_method: 'entrega' | 'retirada'
  status: 'pendente' | 'confirmado' | 'preparando' | 'enviado' | 'entregue' | 'cancelado'
  subtotal_cents: number
  delivery_fee_cents: number
  total_cents: number
  payment_method: 'pix' | 'dinheiro' | 'cartao' | 'fiado'
  payment_status: 'pendente' | 'pago' | 'parcial'
  notes: string | null
  referred_by: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price_cents: number
  total_cents: number
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}
```

**Arquivo:** `types/cart.ts`

```typescript
export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}
```

**Checklist:**
- [x] `types/product.ts` criado
- [x] `types/order.ts` criado
- [x] `types/cart.ts` criado
- [ ] `types/sale.ts` criado (para admin)
- [ ] `types/debt.ts` criado (para admin)

---

#### 5.2 Utility Functions

**Arquivo:** `lib/utils/format.ts`

```typescript
/**
 * Formata centavos para moeda brasileira
 * @example formatCurrency(1500) → "R$ 15,00"
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

/**
 * Formata data para padrão brasileiro
 * @example formatDate(new Date()) → "08/02/2026"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

/**
 * Formata peso em kg
 * @example formatWeight(1.5) → "1,5kg"
 */
export function formatWeight(kg: number): string {
  return `${kg.toString().replace('.', ',')}kg`
}

/**
 * Gera slug a partir de string
 * @example slugify("Pão de Queijo 1kg") → "pao-de-queijo-1kg"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
```

**Arquivo:** `lib/utils/validators.ts`

```typescript
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  category: z.enum(['congelado', 'refrigerado']),
  weight_kg: z.number().positive('Peso deve ser positivo'),
  price_cents: z.number().int().positive('Preço deve ser positivo'),
  stock_quantity: z.number().int().nonnegative('Estoque não pode ser negativo'),
})

export const orderSchema = z.object({
  customer_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  customer_phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido'),
  customer_address: z.string().optional(),
  delivery_method: z.enum(['entrega', 'retirada']),
  notes: z.string().optional(),
  referred_by: z.string().optional(),
})
```

**Checklist:**
- [x] `lib/utils/format.ts` criado
- [x] `lib/utils/validators.ts` criado
- [x] Funções testadas manualmente (build passou)

---

### 6. CARRINHO (ZUSTAND)

**Arquivo:** `lib/cart/store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartState, CartItem } from '@/types/cart'
import type { Product } from '@/types/product'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number) => {
        const items = get().items
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity }] })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
        } else {
          set({
            items: get().items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          })
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price_cents * item.quantity,
          0
        )
      },
    }),
    {
      name: 'mont-cart-storage',
    }
  )
)
```

**Checklist:**
- [x] Store criado com Zustand
- [x] Persistência no localStorage
- [x] Métodos: add, remove, update, clear
- [x] Cálculos: total items, total price

---

### 7. WHATSAPP CHECKOUT

**Arquivo:** `lib/whatsapp/checkout.ts`

```typescript
import type { CartItem } from '@/types/cart'
import { formatCurrency } from '@/lib/utils/format'

interface CheckoutData {
  customerName: string
  customerPhone: string
  customerAddress?: string
  deliveryMethod: 'entrega' | 'retirada'
  items: CartItem[]
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
  referredBy?: string
  notes?: string
}

export function generateWhatsAppMessage(data: CheckoutData): string {
  const {
    customerName,
    customerPhone,
    customerAddress,
    deliveryMethod,
    items,
    subtotalCents,
    deliveryFeeCents,
    totalCents,
    referredBy,
    notes,
  } = data

  let message = `🧀 *Novo Pedido — Mont Distribuidora*\n\n`
  message += `*Cliente:* ${customerName}\n`
  message += `*Telefone:* ${customerPhone}\n`
  
  if (deliveryMethod === 'entrega' && customerAddress) {
    message += `*Entrega:* ${customerAddress}\n`
  } else {
    message += `*Retirada* no local\n`
  }

  message += `\n━━━━━━━━━━━━━━━━\n\n`
  message += `*Itens:*\n`

  items.forEach((item) => {
    const itemTotal = item.product.price_cents * item.quantity
    message += `▸ ${item.product.name} × ${item.quantity} — ${formatCurrency(itemTotal)}\n`
  })

  message += `\n━━━━━━━━━━━━━━━━\n\n`
  message += `*Subtotal:* ${formatCurrency(subtotalCents)}\n`
  
  if (deliveryFeeCents > 0) {
    message += `*Entrega:* ${formatCurrency(deliveryFeeCents)}\n`
  }
  
  message += `*Total:* ${formatCurrency(totalCents)}\n`

  if (referredBy) {
    message += `\n*Indicado por:* ${referredBy}\n`
  }

  if (notes) {
    message += `\n*Obs:* ${notes}\n`
  }

  message += `\nPedido feito pelo site montdistribuidora.com.br`

  return message
}

export function openWhatsApp(phoneNumber: string, message: string) {
  const encodedMessage = encodeURIComponent(message)
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
  window.open(url, '_blank')
}
```

**Checklist:**
- [x] Função `generateWhatsAppMessage` criada
- [x] Formatação conforme PRD (emojis, separadores)
- [x] Função `openWhatsApp` criada
- [ ] Testes manuais com mensagem de exemplo (aguardando UI)

---

### 8. GSAP ANIMATIONS

**Arquivo:** `lib/gsap/animations.ts`

Copiar código do PRD (linhas 638-732):

**Checklist:**
- [ ] `heroTextReveal` implementado
- [ ] `parallaxImage` implementado
- [ ] `scrollReveal` implementado
- [ ] `productCardHover` implementado
- [ ] `sectionColorTransition` implementado
- [ ] `animateCounter` implementado
- [ ] `cartAddFeedback` implementado
- [ ] `pageTransition` implementado

**Arquivo:** `hooks/useScrollAnimation.ts`

```typescript
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const ctx = gsap.context(() => {
      gsap.from(element, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return elementRef
}
```

**Checklist:**
- [ ] GSAP instalado
- [ ] ScrollTrigger plugin registrado
- [ ] Hook `useScrollAnimation` criado
- [ ] Animações respeitam `prefers-reduced-motion`

---

### 9. VERIFICAÇÃO FINAL DO SETUP

#### 9.1 Checklist de Estrutura

- [ ] Projeto Next.js 14 inicializado
- [ ] Todas as dependências instaladas
- [ ] Estrutura de pastas criada conforme PRD
- [ ] Supabase configurado (projeto + migrations + storage)
- [ ] Variáveis de ambiente configuradas
- [ ] Design system implementado (Tailwind + fontes)
- [ ] Componentes UI base criados
- [ ] Types TypeScript definidos
- [ ] Utilities criados
- [ ] Carrinho (Zustand) configurado
- [ ] WhatsApp checkout implementado
- [ ] GSAP animations preparado

---

#### 9.2 Testes de Verificação

**Teste 1: Build sem erros**
```bash
npm run build
# → Deve compilar sem erros TypeScript
```

**Teste 2: Dev server funcional**
```bash
npm run dev
# → http://localhost:3000 deve abrir
```

**Teste 3: Supabase conectado**
```typescript
// Criar página de teste: app/test/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = createClient()
  const { data, error } = await supabase.from('products').select('*')
  
  return (
    <div>
      <h1>Teste Supabase</h1>
      <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
    </div>
  )
}
```

Acessar `/test` → deve retornar array vazio (sem erro).

**Teste 4: Carrinho funcional**
```typescript
// Criar página de teste: app/test-cart/page.tsx
'use client'

import { useCartStore } from '@/lib/cart/store'
import { Button } from '@/components/ui/Button'

export default function TestCartPage() {
  const { items, addItem, getTotalItems } = useCartStore()

  const mockProduct = {
    id: '1',
    name: 'Pão de Queijo Teste',
    price_cents: 1500,
    // ... outros campos
  }

  return (
    <div className="p-8">
      <h1>Teste Carrinho</h1>
      <Button onClick={() => addItem(mockProduct as any, 1)}>
        Adicionar ao carrinho
      </Button>
      <p>Total de itens: {getTotalItems()}</p>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  )
}
```

Acessar `/test-cart` → clicar botão → item deve aparecer.

**Teste 5: WhatsApp message**
```typescript
// Testar geração de mensagem
import { generateWhatsAppMessage } from '@/lib/whatsapp/checkout'

const testData = {
  customerName: 'João Silva',
  customerPhone: '11999999999',
  customerAddress: 'Rua Teste, 123',
  deliveryMethod: 'entrega' as const,
  items: [
    {
      product: {
        name: 'Pão de Queijo 1kg',
        price_cents: 1500,
      },
      quantity: 2,
    },
  ],
  subtotalCents: 3000,
  deliveryFeeCents: 800,
  totalCents: 3800,
}

console.log(generateWhatsAppMessage(testData))
// → Deve gerar mensagem formatada
```

---

#### 9.3 Checklist de Qualidade

- [ ] Nenhum erro TypeScript (`npx tsc --noEmit`)
- [ ] Nenhum erro ESLint (`npm run lint`)
- [ ] Build produção funciona (`npm run build`)
- [ ] Todas as variáveis de ambiente configuradas
- [ ] `.env.local` no `.gitignore`
- [ ] Supabase conectado e migrations executadas
- [ ] Storage configurado e testado
- [ ] Design system aplicado (cores, fontes)
- [ ] Componentes UI renderizam corretamente
- [ ] Carrinho persiste no localStorage
- [ ] WhatsApp message gera formato correto

---

## 🎯 PRÓXIMOS PASSOS (APÓS SETUP)

Após completar este TODO, você estará pronto para:

1. **Implementar páginas públicas:**
   - Home com hero + produtos destaque
   - Catálogo completo
   - Página individual do produto
   - Carrinho + checkout WhatsApp

2. **Integrar dados reais:**
   - Cadastrar produtos no Supabase
   - Upload de imagens
   - Testar fluxo completo de pedido

3. **Deploy na Vercel:**
   - Conectar repositório GitHub
   - Configurar variáveis de ambiente
   - Deploy automático

---

## 📚 REFERÊNCIAS

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [GSAP Docs](https://greensock.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)

---

**Status:** 🟡 Setup em andamento  
**Última atualização:** 08/02/2026
