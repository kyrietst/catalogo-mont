# COMPONENTS.md

## 🧩 Inventário de Componentes

---

## 📦 `src/components/ui/` — Componentes Base

### 1. `Button.tsx`

**Tipo:** Client Component  
**Props:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}
```

**Dependências:** `clsx`, `tailwind-merge`

**Usado em:**
- `ProductCard` (Add to Cart)
- `CartPage` (Finalizar Pedido)
- `Hero` (CTA buttons)

---

### 2. `Card.tsx`

**Tipo:** Server Component  
**Props:**
```tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}
```

**Usado em:**
- `ProductCard`
- `HowItWorks` (feature cards)

---

### 3. `Input.tsx`

**Tipo:** Client Component  
**Props:**
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}
```

**Dependências:** `React Hook Form` (forwardRef)

**Usado em:**
- `CartPage` (checkout form)

---

### 4. `Textarea.tsx`

**Tipo:** Client Component  
**Props:**
```tsx
interface TextareaProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  rows?: number
}
```

**Usado em:**
- `CartPage` (observações)

---

## 🛍️ `src/components/catalog/` — Componentes do Catálogo

### 1. `ProductCard.tsx`

**Tipo:** Client Component (`'use client'`)  
**Props:**
```tsx
interface ProductCardProps {
  product: Product
  index?: number
}
```

**Dependências:**
- `GSAP` (animações)
- `useCartStore` (add to cart)
- `next/image`

**Features:**
- Imagem do produto (placeholder)
- Nome, categoria, peso, preço
- Botão "Adicionar ao Carrinho"
- Animação fade-in (GSAP)

**Usado em:**
- `HomePage` (produtos em destaque)
- `ProductsPage` (grid de produtos)
- `ProductDetailPage` (produtos relacionados)

---

### 2. `ProductCatalog.tsx`

**Tipo:** Client Component (`'use client'`)  
**Props:**
```tsx
interface ProductCatalogProps {
  products: Product[]
}
```

**Dependências:**
- `GSAP` (stagger animations)
- `ProductCard`

**Features:**
- Filtros por categoria (client-side)
- Grid responsivo (2/3/4 colunas)
- Animações stagger (GSAP)

**Usado em:**
- `ProductsPage`

---

### 3. `ProductDetail.tsx`

**Tipo:** Client Component (`'use client'`)  
**Props:**
```tsx
interface ProductDetailProps {
  product: Product
}
```

**Dependências:**
- `GSAP` (animações)
- `useCartStore`
- `next/image`

**Features:**
- Galeria de imagens (placeholder)
- Informações detalhadas
- Botão "Adicionar ao Carrinho"
- Breadcrumbs

**Usado em:**
- `ProductDetailPage`

---

### 4. `CartItem.tsx`

**Tipo:** Client Component  
**Props:**
```tsx
interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
}
```

**Features:**
- Imagem do produto
- Nome, peso, preço
- Input de quantidade
- Botão remover
- Subtotal

**Usado em:**
- `CartPage`

---

## 🌐 `src/components/shared/` — Componentes Compartilhados

### 1. `Navbar.tsx`

**Tipo:** Client Component (`'use client'`)  
**Props:** Nenhuma

**Dependências:**
- `GSAP` (scroll animations)
- `useCartStore` (cart count badge)
- `next/link`

**Features:**
- Logo
- Menu de navegação
- Ícone de carrinho com badge (quantidade)
- Sticky on scroll
- Animação de entrada (GSAP)

**Usado em:**
- Todas as páginas públicas (via layout)

---

### 2. `Footer.tsx`

**Tipo:** Server Component  
**Props:** Nenhuma

**Features:**
- Links de navegação
- Informações de contato
- Redes sociais
- Copyright

**Usado em:**
- Todas as páginas públicas (via layout)

---

## 🎨 `src/components/admin/` — Componentes Admin (Fase 2)

**Status:** Placeholder

Planejado:
- `AdminSidebar`
- `DashboardCard`
- `DataTable`
- `ProductForm`

---

## 📊 Resumo de Componentes

| Componente | Tipo | Dependências | Usado em |
|------------|------|--------------|----------|
| `Button` | Client | clsx, tw-merge | ProductCard, CartPage, Hero |
| `Card` | Server | - | ProductCard, HowItWorks |
| `Input` | Client | React Hook Form | CartPage |
| `Textarea` | Client | - | CartPage |
| `ProductCard` | Client | GSAP, Zustand, next/image | HomePage, ProductsPage, ProductDetailPage |
| `ProductCatalog` | Client | GSAP, ProductCard | ProductsPage |
| `ProductDetail` | Client | GSAP, Zustand, next/image | ProductDetailPage |
| `CartItem` | Client | - | CartPage |
| `Navbar` | Client | GSAP, Zustand, next/link | Layout (todas as páginas) |
| `Footer` | Server | - | Layout (todas as páginas) |

---

## 🎯 Convenções

### Nomenclatura
- **Componentes:** PascalCase (`ProductCard.tsx`)
- **Props Interface:** `{ComponentName}Props`

### Estrutura
```tsx
'use client' // Se necessário

import { ... } from '...'

interface ComponentProps {
  // ...
}

export default function Component({ props }: ComponentProps) {
  // Hooks
  // Handlers
  // Render
  return <div>...</div>
}
```

### Server vs Client
- **Server (padrão):** Sem interatividade, SEO-critical
- **Client (`'use client'`):** Hooks, event handlers, GSAP, Zustand
