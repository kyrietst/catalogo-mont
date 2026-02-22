# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mont Distribuidora digital catalog - a premium e-commerce platform for frozen/refrigerated products with WhatsApp checkout integration. Built with Next.js 14 (App Router), TypeScript, Supabase, and Tailwind CSS.

## Commands

### Development
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Run production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Database (Supabase)
```bash
npm run db:push      # Push local migrations to Supabase
npm run db:pull      # Pull remote schema to local
```

## Architecture

### Hybrid Database Schema

The project uses a **hybrid approach** to protect legacy systems while enabling e-commerce:

**1. Legacy Tables (Portuguese, accessed via Service Role only)**
- `produtos` - Master product data
- `vendas` - Direct sales (offline)
- `contatos` - CRM contacts

**2. Catalog Tables (Portuguese with `cat_` prefix)**
- `cat_pedidos` - Online orders
- `cat_itens_pedido` - Order line items
- `cat_imagens_produto` - Product images

**3. Integration Views**
- `vw_catalogo_produtos` - Public API for product catalog
- `vw_marketing_pedidos` - Unified KPIs (orders + sales)
- `vw_admin_dashboard` - Admin analytics

**Critical: Never directly modify legacy tables from frontend code. Always use views or Service Role API routes.**

### Supabase Client Architecture

**Three client types - use the correct one:**

1. **Browser Client** (`lib/supabase/client.ts`)
   - Use in Client Components
   - Public data access (ANON_KEY)
   - RLS enforced

2. **Server Client** (`lib/supabase/server.ts`)
   - Use in Server Components/Actions
   - Cookie-based auth
   - Two variants:
     - `createClient()` - Cookie-aware (SSR)
     - `createAnonymousClient()` - Static generation (no cookies)

3. **Admin Client** (`lib/supabase/admin.ts`)
   - Use in API Routes only
   - Service Role Key (bypasses RLS)
   - **Never** expose to frontend

### App Router Structure

```
src/app/
├── (public)/           # Public routes (no auth)
│   ├── page.tsx        # Homepage
│   ├── produtos/       # Product catalog
│   ├── carrinho/       # Shopping cart
│   └── sobre/          # About page
├── admin/
│   ├── (protected)/    # Auth-required routes
│   │   └── layout.tsx  # Auth check via Supabase
│   └── login/          # Admin login
└── api/
    ├── pedidos/        # Public: Create orders
    └── admin/          # Protected: Admin operations
```

**Route Groups:** Parentheses like `(public)` and `(protected)` organize routes without affecting URLs.

### State Management

**Zustand Cart Store** (`lib/cart/store.ts`)
- Client-side persistent cart (localStorage)
- Methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getTotalItems`, `getTotalPrice`
- Auto-persists with `persist` middleware

**Pattern:**
```typescript
import { useCartStore } from '@/lib/cart/store'

const { items, addItem, getTotalPrice } = useCartStore()
```

### WhatsApp Checkout Flow

1. User fills checkout form (`src/app/(public)/carrinho/page.tsx`)
2. Order saved to `cat_pedidos` via API route (`/api/pedidos/route.ts`)
3. WhatsApp message generated (`lib/whatsapp/checkout.ts`)
4. User redirected to WhatsApp with pre-filled message
5. Admin receives order notification

**Important:** Orders are saved to database BEFORE WhatsApp redirect. Never rely solely on WhatsApp for order tracking.

### Authentication

- **Middleware** (`src/middleware.ts`) protects `/admin/*` routes
- **Layout Auth** (`admin/(protected)/layout.tsx`) redirects if not authenticated
- Uses Supabase Auth with cookie-based sessions

## Design System

**Mont Premium Design Language**

Colors (Tailwind classes):
- `mont-cream` (#FAF7F2) - Main background
- `mont-espresso` (#2C1810) - Primary text
- `mont-gold` (#C8963E) - Accent/CTAs
- `mont-gold-light` (#E8C876) - Accent hover

Typography:
- `font-display` - Playfair Display (headings)
- `font-body` - DM Sans (body text)
- Responsive sizes: `text-hero`, `text-display`, `text-heading`, `text-subhead`

**Design Philosophy:**
- Mobile-first (90%+ mobile traffic)
- Product-first (large images, generous whitespace)
- GSAP animations for scroll effects (`lib/gsap/animations.ts`)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # API routes only
NEXT_PUBLIC_WHATSAPP_NUMBER=        # Format: 5511999999999
NEXT_PUBLIC_APP_URL=
```

## Type Safety

- All database models defined in `src/types/`
- Product type uses `price_cents` (integer, not float)
- Use Zod for API validation (`lib/utils/validators.ts`)

## Common Patterns

### Fetching Products (Server Component)
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data } = await supabase
  .from('vw_catalogo_produtos')  // Use view, not products table
  .select('*')
  .eq('is_active', true)
```

### Creating Orders (API Route)
```typescript
import { supabaseAdmin } from '@/lib/supabase/admin'

// Use Service Role to bypass RLS
const { data } = await supabaseAdmin
  .from('cat_pedidos')
  .insert({ ... })
```

### Currency Formatting
```typescript
import { formatCurrency } from '@/lib/utils/format'

formatCurrency(priceCents) // priceCents is integer (e.g., 3000 = R$ 30,00)
```

## Migration Notes

Database migrations are in `supabase/migrations/`:
- `001_initial_schema.sql` - Core tables, indexes, RLS policies
- `002_seed_products.sql` - Sample data

Run migrations via Supabase CLI or Dashboard SQL Editor.

## Import Aliases

Use `@/` for all imports:
```typescript
import { Product } from '@/types/product'
import { createClient } from '@/lib/supabase/client'
```

## Additional Documentation

- [README.md](./README.md) - Full project overview
- [Mont_Distribuidora_PRD_Catalogo.md](./Mont_Distribuidora_PRD_Catalogo.md) - Product requirements
- Database schema: `supabase/migrations/001_initial_schema.sql`
