# CHANGELOG.md

## 📝 Log de Desenvolvimento

---

## Sessão 4 — Páginas Públicas + Correção de Build (2026-02-08)

### O que foi feito

**Implementação:**
1. ✅ 4 páginas públicas completas:
   - Home (`/`) com hero parallax GSAP
   - Catálogo (`/produtos`) com filtros e grid responsivo
   - Produto Individual (`/produtos/[slug]`) com produtos relacionados
   - Carrinho (`/carrinho`) com formulário Zod + WhatsApp checkout

2. ✅ API route `/api/pedidos` (POST)
   - Validação Zod
   - Geração de URL do WhatsApp

3. ✅ Correção de build errors:
   - Limpeza de cache (`.next`, `node_modules/.cache`)
   - Estratégia de dados corrigida: Supabase → Mock fallback
   - `export const dynamic = 'force-dynamic'` em páginas SSR
   - Remoção de `createAnonymousClient()` (desnecessário)

4. ✅ Documentação completa em `.docs/`:
   - `ARCHITECTURE.md` — Stack, decisões, estrutura
   - `DATABASE.md` — Schema completo do Supabase
   - `DATABASE_OWNERSHIP.md` — Mapa de permissões
   - `ROUTES.md` — Rotas e API
   - `COMPONENTS.md` — Inventário de componentes
   - `ENV.md` — Variáveis de ambiente
   - `CHANGELOG.md` — Este arquivo

**Arquivos Criados:**
- `src/app/(public)/page.tsx`
- `src/app/(public)/produtos/page.tsx`
- `src/app/(public)/produtos/[slug]/page.tsx`
- `src/app/(public)/carrinho/page.tsx`
- `src/app/api/pedidos/route.ts`
- `src/components/catalog/ProductCard.tsx`
- `src/components/catalog/ProductCatalog.tsx`
- `src/components/catalog/ProductDetail.tsx`
- `src/components/catalog/CartItem.tsx`
- `src/lib/whatsapp/checkout.ts`
- `src/lib/store/cart.ts`
- `src/hooks/useCart.ts`
- `.docs/ARCHITECTURE.md`
- `.docs/DATABASE.md`
- `.docs/DATABASE_OWNERSHIP.md`
- `.docs/ROUTES.md`
- `.docs/COMPONENTS.md`
- `.docs/ENV.md`
- `.docs/CHANGELOG.md`

**Arquivos Modificados:**
- `src/app/(public)/page.tsx` — Restaurada busca Supabase com fallback
- `src/app/(public)/produtos/page.tsx` — Restaurada busca Supabase com fallback
- `src/app/(public)/produtos/[slug]/page.tsx` — Restaurada busca Supabase com fallback
- `src/lib/supabase/server.ts` — Removido `createAnonymousClient()`

**Decisões Técnicas:**
- **SSR com `force-dynamic`** em vez de SSG — Dados sempre atualizados
- **Supabase → Mock fallback** — Resiliência sem rebuild
- **WhatsApp checkout** em vez de gateway de pagamento — Modelo de negócio B2B/B2C

**Build Status:** ✅ Passou

---

## Sessão 3 — Migrations, Seed, Componentes UI, GSAP (2026-02-08)

### O que foi feito

**Implementação:**
1. ✅ Migrations do Supabase aplicadas
2. ✅ Seed de produtos mockados
3. ✅ Componentes UI base:
   - `Button`, `Card`, `Input`, `Textarea`
4. ✅ Componentes shared:
   - `Navbar` (com GSAP scroll animations)
   - `Footer`
5. ✅ Animações GSAP configuradas

**Arquivos Criados:**
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Textarea.tsx`
- `src/components/shared/Navbar.tsx`
- `src/components/shared/Footer.tsx`

---

## Sessão 2 — Reestruturação para `src/` (2026-02-08)

### O que foi feito

**Implementação:**
1. ✅ Movida pasta `app/` para `src/app/`
2. ✅ Criada estrutura de pastas:
   - `src/components/`
   - `src/lib/`
   - `src/types/`
   - `src/hooks/`
3. ✅ Atualizado `tsconfig.json` com paths

**Arquivos Modificados:**
- `tsconfig.json` — Adicionado `baseUrl: "."` e `paths`
- `next.config.ts` — Sem mudanças (Next.js detecta `src/` automaticamente)

---

## Sessão 1 — Setup Inicial (2026-02-08)

### O que foi feito

**Implementação:**
1. ✅ Criado projeto Next.js 14 com TypeScript
2. ✅ Instaladas dependências:
   - `@supabase/ssr`
   - `@supabase/supabase-js`
   - `tailwindcss`
   - `gsap`
   - `zustand`
   - `zod`
   - `react-hook-form`
   - `@hookform/resolvers`
3. ✅ Configurado Tailwind CSS
4. ✅ Criado `.env.local.example`
5. ✅ Criado `.gitignore`

**Arquivos Criados:**
- `package.json`
- `next.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `.env.local.example`
- `.gitignore`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/client.ts`
- `src/lib/utils/format.ts`
- `src/lib/utils/cn.ts`
- `src/types/database.types.ts`
- `src/types/product.ts`
- `src/types/cart.ts`

**Decisões Técnicas:**
- **Next.js 14** — App Router para SSR e SEO
- **Tailwind CSS** — Utility-first para rapidez
- **GSAP** — Animações premium
- **Zustand** — State management simples
- **Zod** — Validação type-safe

---

## 🔮 Próximos Passos (Fase 2)

1. **Sistema Interno (Admin):**
   - Dashboard de vendas
   - CRUD de produtos
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
   - Testes automatizados (Vitest + Playwright)
   - CI/CD pipeline (GitHub Actions)
