# FASE 2 — PAINEL ADMIN + IMAGENS PLACEHOLDER + AUTENTICAÇÃO (COMPLETED)

## STATUS: CONCLUÍDO ✅

Todas as tarefas deste prompt foram implementadas com sucesso na Sessão 6 (2026-02-09).

---

## CONTEXTO ORIGINAL

A Fase 1 (Catálogo Público) está em produção na Vercel. O banco Supabase
tem as tabelas `cat_pedidos`, `cat_itens_pedido`, `cat_imagens_produto`
criadas (migration 003), e as views `vw_catalogo_produtos`,
`vw_marketing_pedidos`, `vw_admin_dashboard` funcionando.

Agora precisamos implementar 3 coisas nesta sessão:
1. [x] Popular `cat_imagens_produto` com as imagens SVG placeholder
2. [x] Implementar autenticação (Supabase Auth)
3. [x] Criar o painel admin mobile-first

LEIA `.docs/DATABASE_OWNERSHIP.md` e `.docs/DATABASE.md` antes de começar.

---

## TAREFA 1 — POPULAR IMAGENS PLACEHOLDER NO BANCO

21: Os SVGs já existem em `public/images/products/`. A tabela
22: `cat_imagens_produto` está vazia, por isso `primary_image_url` vem
23: null na view `vw_catalogo_produtos`.

25: ### Passo 1: Verificar quais SVGs existem
26: ```bash
27: ls -la public/images/products/
28: ```

30: ### Passo 2: Verificar os produto_id e slugs reais
31: Use o MCP supabase-distribuidora:
32: ```sql
33: SELECT id, nome, slug FROM produtos WHERE ativo = true;
34: ```

36: ### Passo 3: Gerar e MOSTRAR (não executar) o SQL de INSERT
37: Para cada produto ativo, inserir em `cat_imagens_produto`:

39: ```sql
40: INSERT INTO cat_imagens_produto (produto_id, url, texto_alternativo, ordem, principal)
41: VALUES
42:   ('<uuid_produto_1>', '/images/products/<slug_1>.svg', '<nome_produto_1>', 0, true),
43:   ('<uuid_produto_2>', '/images/products/<slug_2>.svg', '<nome_produto_2>', 0, true),
44:   -- ... repetir para todos os produtos ativos
45: ;
46: ```

48: Use os IDs e slugs REAIS do banco. Se algum produto não tiver slug,
49: use o nome em kebab-case como referência para o nome do arquivo SVG.
50: Confirme que CADA arquivo SVG referenciado EXISTE em `public/images/products/`.

52: ### Passo 4: Após minha aprovação, executar o INSERT
53: Depois verificar:
54: ```sql
55: SELECT * FROM vw_catalogo_produtos;
56: ```
57: O campo `primary_image_url` deve agora retornar a URL do SVG.

---

## TAREFA 2 — AUTENTICAÇÃO SUPABASE AUTH

63: Implementar login com email/senha para proteger rotas `/admin/*`.

65: ### 2.1 — Criar usuário admin no Supabase

67: Via MCP, APENAS me mostre o procedimento. NÃO execute sem aprovação.

69: O usuário admin será criado manualmente pelo Gilmar no Supabase
70: Dashboard (Authentication > Users > Invite User). Não crie via SQL.

72: ### 2.2 — Middleware de proteção

74: Criar `src/middleware.ts` na raiz do src:

76: ```typescript
77: // Proteger todas as rotas /admin/*
78: // Se não autenticado → redirecionar para /admin/login
79: // Se autenticado → permitir acesso
80: // Usar createServerClient do @supabase/ssr
81: ```

83: Instalar dependência se necessário:
84: ```bash
85: npm install @supabase/ssr
86: ```

88: ### 2.3 — Página de login

90: Criar `src/app/admin/login/page.tsx`:
91: - Design seguindo o Design System Mont Premium (cores, fontes)
92: - Campo email + senha
93: - Botão "Entrar" com loading state
94: - Tratamento de erro (credenciais inválidas)
95: - Redirect para `/admin` após login
96: - Mobile-first (pai usa celular)
97: - `'use client'` (interação com formulário)

99: ### 2.4 — Layout admin

101: Criar `src/app/admin/layout.tsx`:
102: - Verificar autenticação server-side
103: - Se não autenticado → redirect para `/admin/login`
104: - Header simplificado com logo Mont + botão "Sair"
105: - Navegação mobile: bottom nav ou hamburger com links para
106:   Dashboard, Produtos, Pedidos
107: - Background: mont-cream (#FAF7F2)
108: - NÃO usar o Navbar/Footer do catálogo público

110: ### 2.5 — Logout

112: API route `src/app/api/auth/logout/route.ts` ou handler no layout:
113: - Destruir sessão Supabase
114: - Redirect para `/admin/login`

---

## TAREFA 3 — PAINEL ADMIN

120: ### DECISÕES JÁ TOMADAS:
121: - **Preço:** O preço no site é SEMPRE o mesmo do sistema interno
122:   (`produtos.preco`). NÃO criar coluna `preco_catalogo`.
123:   A view `vw_catalogo_produtos` já converte `preco` (NUMERIC reais)
124:   para `price_cents` (integer centavos). No admin, mostrar em reais.
125: - **Autenticação:** Com login desde o início (Tarefa 2 acima).
126: - **Mobile-first:** O usuário principal (pai do Gilmar) opera
127:   100% pelo celular.

129: ### 3.1 — Dashboard (`/admin`)

131: Criar `src/app/admin/page.tsx` (Server Component):

133: Consultar `vw_admin_dashboard` para obter:
134: - Faturamento do dia (online + vendas diretas)
135: - Pedidos pendentes (status = 'pendente')
136: - Total de produtos ativos vs inativos
137: - Produtos com estoque baixo

139: Layout mobile:
140: - Cards grandes com números (tipo o design do sistema interno)
141: - Fonte JetBrains Mono para valores monetários
142: - Cores: mont-gold para destaques, mont-danger para alertas
143: - Link rápido para "Ver Pedidos Pendentes"

145: ### 3.2 — Gestão de Produtos (`/admin/produtos`)

147: Criar `src/app/admin/produtos/page.tsx`:

149: **Funcionalidade principal:** Lista TODOS os produtos da tabela
150: `produtos` (não só os ativos), com toggle para controlar visibilidade
151: no catálogo.

153: Para cada produto, mostrar:
154: - Nome do produto
155: - Preço (formatado em reais, vem de `produtos.preco`)
156: - Toggle ativo/inativo (controla coluna `produtos.ativo`)
157: - Badge de categoria se preenchida
158: - Indicador de estoque (disponível / baixo / esgotado)

160: **Toggle ativo/inativo:**
161: Ao clicar, fazer UPDATE via API route:
162: ```sql
163: UPDATE produtos SET ativo = NOT ativo WHERE id = '<uuid>';
164: ```

166: ATENÇÃO: Esta é uma das ÚNICAS operações de escrita que o catálogo
167: faz na tabela `produtos`. Documentar em DATABASE_OWNERSHIP.md.

169: **Edição inline (expandir ao tocar no produto):**
170: Campos editáveis do catálogo (NÃO do sistema interno):
171: - `descricao` (textarea)
172: - `categoria` (select: 'congelado' | 'refrigerado')
173: - `peso_kg` (input number)
174: - `destaque` (toggle boolean)
175: - `slug` (input text, auto-gerar se vazio)

177: NÃO permitir editar: `nome`, `preco`, `estoque_atual`, `estoque_minimo`
178: (esses vêm do sistema interno e o pai edita por lá).

180: **API routes necessárias:**

182: `src/app/api/admin/produtos/route.ts`:
183: - GET → SELECT * FROM produtos ORDER BY nome
184: - Usar `createClient()` com service role para bypass de RLS

186: `src/app/api/admin/produtos/[id]/route.ts`:
187: - PATCH → UPDATE produtos SET campo = valor WHERE id = :id
188: - Campos permitidos: ativo, descricao, categoria, peso_kg,
189:   destaque, slug
190: - Validar com Zod que apenas campos permitidos são enviados
191: - Retornar produto atualizado

193: ### 3.3 — Gestão de Pedidos (`/admin/pedidos`)

195: Criar `src/app/admin/pedidos/page.tsx`:

197: **Funcionalidade:** Lista pedidos de `cat_pedidos` com filtro por
198: status e possibilidade de mudar status.

200: Para cada pedido, mostrar:
201: - Número do pedido (`numero_pedido`)
202: - Nome do cliente
203: - Telefone (com link `tel:`)
204: - Total (formatado em reais, converter de centavos)
205: - Status atual (badge colorida)
206: - Data/hora (formatada BR)
207: - Método de entrega
208: - Método de pagamento

210: **Mudança de status:**
211: Select com opções: pendente → confirmado → preparando → enviado →
212: entregue (ou cancelado em qualquer ponto).

214: **Expandir pedido (ver itens):**
215: Ao tocar, mostrar itens de `cat_itens_pedido`:
216: - Nome do produto
217: - Quantidade
218: - Preço unitário
219: - Total do item

221: **Filtros (top da página):**
222: - Todos | Pendentes | Em andamento | Entregues | Cancelados
223: - Ordenar por: mais recentes primeiro

225: **API routes necessárias:**

227: `src/app/api/admin/pedidos/route.ts`:
228: - GET → SELECT * FROM cat_pedidos ORDER BY criado_em DESC
229:   com JOIN em cat_itens_pedido para incluir itens

231: `src/app/api/admin/pedidos/[id]/route.ts`:
232: - PATCH → UPDATE cat_pedidos SET status = :status WHERE id = :id
233: - Validar que status é um dos valores permitidos
234: - Retornar pedido atualizado

---

## REGRAS GERAIS

240: 1. **Design System Mont Premium OBRIGATÓRIO:**
241:    - Cores: mont-cream, mont-espresso, mont-gold (ver globals.css)
242:    - Fontes: Playfair Display (títulos), DM Sans (corpo),
243:      JetBrains Mono (números/preços)
244:    - NÃO usar shadcn/ui, NÃO usar Framer Motion
245:    - NÃO usar cores purple/violet
246:    - Componentes admin em `src/components/admin/`

248: 2. **Supabase:**
249:    - API routes admin usam `createClient()` com service role
250:      (SUPABASE_SERVICE_ROLE_KEY) para bypass de RLS
251:    - Client Components usam `createClient()` do browser
252:    - NUNCA usar anon key para operações admin

254: 3. **Segurança:**
255:    - Todas as API routes `/api/admin/*` devem verificar auth
256:    - Se não autenticado → retornar 401
257:    - Middleware protege as páginas, API routes verificam independente

259: 4. **Mobile-first:**
260:    - Breakpoint principal: 375px (iPhone SE)
261:    - Touch targets mínimos: 44x44px
262:    - Toggles grandes e fáceis de clicar
263:    - Scroll vertical, evitar tabelas horizontais
264:    - Usar cards empilhados, não tabelas

266: 5. **Build:**
267:    - `npm run build` DEVE passar com 0 erros
268:    - Rotas admin devem aparecer como ƒ (Dynamic) no output

270: 6. **Documentação:**
271:    - Atualizar `.docs/ROUTES.md` com as novas rotas admin
272:    - Atualizar `.docs/COMPONENTS.md` com componentes admin
273:    - Atualizar `.docs/DATABASE_OWNERSHIP.md` com a permissão de
274:      UPDATE em `produtos.ativo` pelo catálogo
275:    - Atualizar `.docs/CHANGELOG.md` com esta sessão

---

## ESTRUTURA DE PASTAS ESPERADA

281: ```
282: src/
283: ├── app/
284: │   ├── admin/
285: │   │   ├── layout.tsx              ← Layout admin (auth check, nav)
286: │   │   ├── page.tsx                ← Dashboard
287: │   │   ├── login/
288: │   │   │   └── page.tsx            ← Página de login
289: │   │   ├── produtos/
290: │   │   │   └── page.tsx            ← Gestão produtos + toggles
291: │   │   └── pedidos/
292: │   │       └── page.tsx            ← Gestão pedidos + status
293: │   ├── api/
294: │   │   ├── auth/
295: │   │   │   └── logout/
296: │   │   │       └── route.ts        ← Logout handler
297: │   │   └── admin/
298: │   │       ├── produtos/
299: │   │       │   ├── route.ts        ← GET todos produtos
300: │   │       │   └── [id]/
301: │   │       │       └── route.ts    ← PATCH produto
302: │   │       └── pedidos/
303: │   │           ├── route.ts        ← GET todos pedidos
304: │   │           └── [id]/
305: │   │               └── route.ts    ← PATCH status pedido
306: ├── components/
307: │   └── admin/
308: │       ├── AdminHeader.tsx         ← Header com logo + sair
309: │       ├── AdminNav.tsx            ← Bottom nav mobile
310: │       ├── ProductCard.tsx         ← Card produto com toggle
311: │       ├── ProductEditForm.tsx     ← Form edição inline
312: │       ├── OrderCard.tsx           ← Card pedido com status
313: │       ├── OrderItems.tsx          ← Lista itens expandida
314: │       ├── DashboardCard.tsx       ← Card KPI (número grande)
315: │       └── StatusBadge.tsx         ← Badge colorida por status
316: ├── middleware.ts                   ← Proteção rotas /admin/*
317: ```
