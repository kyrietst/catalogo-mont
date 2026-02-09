# ENV.md

## 🔐 Variáveis de Ambiente

---

## 📋 Variáveis Obrigatórias

### 1. `NEXT_PUBLIC_SUPABASE_URL`

**Descrição:** URL do projeto Supabase  
**Tipo:** Pública (client-side)  
**Obrigatória:** ✅ Sim

**Valor Exemplo:**
```
https://[SUPABASE_PROJECT_ID].supabase.co
```

**Onde é usada:**
- `src/lib/supabase/server.ts` — `createClient()`
- `src/lib/supabase/client.ts` — `createBrowserClient()`

**Como obter:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Settings → API → Project URL

---

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Descrição:** Chave pública (anon) do Supabase  
**Tipo:** Pública (client-side)  
**Obrigatória:** ✅ Sim

**Valor Exemplo:**
```
[SUPABASE_ANON_KEY]
```

**Onde é usada:**
- `src/lib/supabase/server.ts` — `createClient()`
- `src/lib/supabase/client.ts` — `createBrowserClient()`

**Permissões:**
- Read-only em `produtos` (via RLS)
- Não pode fazer DDL operations

**Como obter:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Settings → API → Project API keys → `anon` `public`

---

### 3. `SUPABASE_SERVICE_ROLE_KEY`

**Descrição:** Chave privada (service role) do Supabase  
**Tipo:** Privada (server-side ONLY)  
**Obrigatória:** ✅ Sim (Fase 2)

**Valor Exemplo:**
```
[SUPABASE_SERVICE_ROLE_KEY]
```

**Onde é usada:**
- `src/app/api/pedidos/route.ts` — Bypass RLS (Fase 2)

**Permissões:**
- CRUD completo em todas as tabelas
- Bypass RLS

**⚠️ ATENÇÃO:**
- **NUNCA** expor no client-side
- **NUNCA** commitar no Git
- Usar apenas em API routes ou server-side code

**Como obter:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Settings → API → Project API keys → `service_role` `secret`

---

### 4. `NEXT_PUBLIC_WHATSAPP_NUMBER`

**Descrição:** Número do WhatsApp Business (formato internacional)  
**Tipo:** Pública (client-side)  
**Obrigatória:** ✅ Sim

**Valor Exemplo:**
```
5511999999999
```

**Formato:** `{código_país}{DDD}{número}` (sem espaços, hífens ou parênteses)

**Onde é usada:**
- `src/lib/whatsapp/checkout.ts` — `generateWhatsAppUrl()`
- `src/app/(public)/carrinho/page.tsx` — Botão "Finalizar Pedido"

**Como obter:**
1. Número do WhatsApp Business da Mont Distribuidora
2. Remover formatação: `(11) 99999-9999` → `5511999999999`

---

### 5. `NEXT_PUBLIC_APP_URL`

**Descrição:** URL base da aplicação  
**Tipo:** Pública (client-side)  
**Obrigatória:** ✅ Sim

**Valor Exemplo:**
```
# Local
http://localhost:3000

# Produção
https://catalogo-mont.vercel.app
```

**Onde é usada:**
- Metadata (OG tags, canonical URLs)
- Redirects (se necessário)

---

## 📋 Variáveis Opcionais (Fase 2)

### 6. `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`

**Descrição:** ID do Google Analytics  
**Tipo:** Pública (client-side)  
**Obrigatória:** ❌ Não

**Valor Exemplo:**
```
G-XXXXXXXXXX
```

**Onde será usada:**
- `src/app/layout.tsx` — Google Analytics script

---

### 7. `NEXT_PUBLIC_SENTRY_DSN`

**Descrição:** DSN do Sentry (error tracking)  
**Tipo:** Pública (client-side)  
**Obrigatória:** ❌ Não

**Valor Exemplo:**
```
https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**Onde será usada:**
- `sentry.client.config.ts`
- `sentry.server.config.ts`

---

## 📝 Arquivo `.env.local`

**Localização:** Raiz do projeto

**Template (`.env.local.example`):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[SUPABASE_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUPABASE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SUPABASE_SERVICE_ROLE_KEY]

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Deployment (Vercel)

### Configurar Variáveis

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Settings → Environment Variables
4. Adicione cada variável:
   - **Key:** Nome da variável
   - **Value:** Valor
   - **Environments:** Production, Preview, Development

### Variáveis por Ambiente

| Variável | Production | Preview | Development |
|----------|------------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://...` | `https://...` | `http://localhost:3000` |

---

## 🔒 Segurança

### Regras de Ouro

1. **NUNCA** commitar `.env.local` no Git
2. **NUNCA** expor `SUPABASE_SERVICE_ROLE_KEY` no client-side
3. **SEMPRE** usar `NEXT_PUBLIC_` para variáveis client-side
4. **SEMPRE** adicionar `.env.local` no `.gitignore`

### Verificação

```bash
# Verificar se .env.local está no .gitignore
cat .gitignore | grep .env.local

# Verificar se .env.local NÃO está commitado
git ls-files | grep .env.local
# (não deve retornar nada)
```

---

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api#api-url-and-keys)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
