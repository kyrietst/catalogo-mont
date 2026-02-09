# Mont Distribuidora — Catálogo Digital

Plataforma digital premium da Mont Distribuidora: catálogo de produtos + checkout via WhatsApp.

## 🎯 Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Banco de Dados:** Supabase (PostgreSQL)
- **Estilização:** Tailwind CSS
- **Animações:** GSAP
- **State Management:** Zustand
- **Validação:** Zod + React Hook Form
- **Deploy:** Vercel (dev) → VPS Hostinger (produção)

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase

### Instalação

1. **Clone o repositório:**
```bash
git clone [URL_DO_REPO]
cd catalogo-mont
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Copie `.env.local.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Execute as migrations do Supabase:**

Via Supabase CLI:
```bash
supabase link --project-ref SEU_PROJECT_ID
supabase db push
```

Ou copie o SQL de `supabase/migrations/001_initial_schema.sql` e execute no SQL Editor do Supabase Dashboard.

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
catalogo-mont/
├── app/                      # Next.js App Router
│   ├── (public)/            # Rotas públicas (catálogo)
│   ├── admin/               # Rotas protegidas (gestão)
│   ├── api/                 # API Routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Estilos globais
├── components/              # Componentes React
│   ├── ui/                  # Componentes base
│   ├── catalog/             # Componentes do catálogo
│   ├── admin/               # Componentes admin
│   └── shared/              # Compartilhados
├── lib/                     # Utilitários e configurações
│   ├── supabase/            # Clientes Supabase
│   ├── cart/                # Store do carrinho
│   ├── whatsapp/            # Integração WhatsApp
│   ├── gsap/                # Animações
│   └── utils/               # Funções auxiliares
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
├── supabase/                # Migrations SQL
└── public/                  # Arquivos estáticos
```

## 🎨 Design System — "Mont Premium"

Inspirado em Apple.com, o design segue os princípios:

- **Produto como protagonista:** Fotos grandes, whitespace generoso
- **Motion com propósito:** GSAP para parallax e scroll reveals
- **Tipografia editorial:** Playfair Display + DM Sans
- **Mobile-first:** 90%+ do acesso é mobile

### Paleta de Cores

```css
--mont-cream:      #FAF7F2  /* Background principal */
--mont-espresso:   #2C1810  /* Texto principal */
--mont-gold:       #C8963E  /* Accent */
--mont-gold-light: #E8C876  /* Accent hover */
```

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## 🔐 Supabase

### Tabelas Principais

- `products` — Produtos do catálogo
- `product_images` — Imagens dos produtos
- `orders` — Pedidos via site
- `order_items` — Itens dos pedidos
- `direct_sales` — Vendas diretas (admin)
- `customers` — CRM básico

### RLS (Row Level Security)

- Produtos ativos: leitura pública
- Pedidos: criação pública, gestão apenas autenticado
- Admin: apenas autenticado

## 🛒 Checkout WhatsApp

O checkout gera uma mensagem formatada e abre o WhatsApp:

```
🧀 *Novo Pedido — Mont Distribuidora*

*Cliente:* João Silva
*Telefone:* (11) 99999-9999
*Entrega:* Rua Exemplo, 123

━━━━━━━━━━━━━━━━

*Itens:*
▸ Pão de Queijo 1kg × 2 — R$ 30,00

━━━━━━━━━━━━━━━━

*Total:* R$ 30,00
```

## 🚀 Deploy

### Vercel (Desenvolvimento)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### VPS Hostinger (Produção)

Instruções na Fase 4 do PRD.

## 📚 Documentação

- [PRD Completo](./Mont_Distribuidora_PRD_Catalogo.md)
- [TODO Técnico](./TODO.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [GSAP Docs](https://greensock.com/docs/)

## 📄 Licença

Propriedade de Mont Distribuidora © 2026

---

**Desenvolvido por:** Kyrie Performance & Resultados  
**Contato:** [contato@montdistribuidora.com.br]
