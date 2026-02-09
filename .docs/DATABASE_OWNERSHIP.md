# DATABASE_OWNERSHIP.md

## 🎯 Mapa de Propriedade de Tabelas

Este documento define **QUEM** pode fazer **O QUÊ** em cada tabela do Supabase.

---

## 📋 REGRAS DE OURO

### Catálogo (App Público)

**NUNCA PODE:**
- ❌ `DROP`, `ALTER`, `TRUNCATE` em **NENHUMA** tabela
- ❌ `CREATE TABLE`, `CREATE INDEX`, `CREATE TRIGGER`
- ❌ Modificar schema do banco

**PODE:**
- ✅ `SELECT` em: `produtos`
- ✅ `INSERT` em: (nenhuma tabela diretamente — usa API `/api/pedidos`)

**OBSERVAÇÃO:** O catálogo **NÃO** escreve diretamente no Supabase. Todos os pedidos são enviados via WhatsApp e registrados manualmente no Sistema Interno.

### Sistema Interno (App Admin)

**OWNER de TODAS as tabelas:**
- ✅ CRUD completo em todas as tabelas
- ✅ Pode executar migrations
- ✅ Pode criar/modificar schema

---

## 📊 Tabelas e Permissões

### `produtos`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `SELECT` (read-only)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca faz `INSERT`, `UPDATE`, `DELETE`
- **RLS:** Desabilitado (tabela pública)

**Justificativa:** Produtos são gerenciados apenas pelo admin. Catálogo apenas exibe.

---

### `contatos`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Desabilitado

**Justificativa:** CRM interno. Catálogo não gerencia clientes.

---

### `vendas`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Desabilitado

**Justificativa:** Vendas são registradas manualmente no Sistema Interno após confirmação via WhatsApp.

---

### `itens_venda`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Desabilitado

**Justificativa:** Itens de venda são gerenciados pelo Sistema Interno.

---

### `configuracoes`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Desabilitado

**Justificativa:** Configurações internas do sistema.

---

### `purchase_orders`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Habilitado (policy: "Enable all access")

**Justificativa:** Gestão de compras do Sistema Interno.

---

### `purchase_order_items`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Habilitado (policy: "Enable all access")

**Justificativa:** Itens de pedidos de compra do Sistema Interno.

---

### `purchase_order_payments`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Habilitado (policy: "Enable all access for all users")

**Justificativa:** Pagamentos de pedidos de compra do Sistema Interno.

---

### `pagamentos_venda`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** `NENHUM` (não acessa)
- **SISTEMA INTERNO:** `CRUD` completo
- **NUNCA:** Catálogo nunca acessa esta tabela
- **RLS:** Desabilitado

**Justificativa:** Pagamentos de vendas gerenciados pelo Sistema Interno.

---

## 🔧 Functions (RPCs)

### `receive_purchase_order(p_order_id uuid)`
- **OWNER:** Sistema Interno
- **CATÁLOGO:** Não usa
- **SISTEMA INTERNO:** Executa ao receber pedido de compra

### `update_atualizado_em()`
- **OWNER:** Sistema Interno (trigger function)
- **CATÁLOGO:** Não usa
- **SISTEMA INTERNO:** Trigger automático em UPDATE

### `handle_stock_on_status_change()`
- **OWNER:** Sistema Interno (trigger function)
- **CATÁLOGO:** Não usa
- **SISTEMA INTERNO:** Trigger automático ao mudar status de venda

### `update_purchase_order_payment_status()`
- **OWNER:** Sistema Interno (trigger function)
- **CATÁLOGO:** Não usa
- **SISTEMA INTERNO:** Trigger automático em pagamentos

### `update_venda_pagamento_summary()`
- **OWNER:** Sistema Interno (trigger function)
- **CATÁLOGO:** Não usa
- **SISTEMA INTERNO:** Trigger automático em pagamentos de venda

---

## 🛡️ RLS Policies

### `purchase_orders`
- **Policy:** "Enable all access"
- **Operação:** `ALL`
- **Condição:** `true` (acesso público)

### `purchase_order_items`
- **Policy:** "Enable all access"
- **Operação:** `ALL`
- **Condição:** `true` (acesso público)

### `purchase_order_payments`
- **Policy:** "Enable all access for all users"
- **Operação:** `ALL`
- **Condição:** `true` (acesso público)

**OBSERVAÇÃO:** Estas policies permitem acesso público, mas o Catálogo **NÃO** acessa estas tabelas por design.

---

## 📝 Resumo por App

### Catálogo (Público)
**Acesso READ:**
- `produtos` (via `createClient()` com `force-dynamic`)

**Acesso WRITE:**
- Nenhum (pedidos via WhatsApp)

**Proibido:**
- DDL operations
- Qualquer escrita direta no banco

### Sistema Interno (Admin)
**Acesso CRUD:**
- Todas as tabelas
- Todas as functions
- Pode executar migrations

**Responsabilidades:**
- Gerenciar produtos
- Registrar vendas (após WhatsApp)
- Gerenciar clientes
- Gerenciar estoque
- Gerenciar compras

---

## 🔄 MAPEAMENTO DE NOMES (Schema → Types)

### Função `mapProdutoToProduct()`

**Localização:** `src/lib/supabase/mappers.ts`

**Descrição:** Converte dados da tabela `produtos` (schema do banco) para o type `Product` (frontend).

### Tabela de Mapeamento Completo

| Coluna DB (`produtos`) | Type TS (`Product`) | Transformação | Observações |
|------------------------|---------------------|---------------|-------------|
| `id` | `id` | Direto | UUID |
| `nome` | `name` | Direto | - |
| `codigo` | `slug` | `codigo.replace(/_/g, '-')` | Converte `_` para `-` |
| `preco` | `price_cents` | `parseFloat(preco) * 100` | Decimal → Centavos |
| `custo` | `cost_cents` | `parseFloat(custo) * 100` | Decimal → Centavos |
| `unidade` | - | **NÃO MAPEADO** | Não usado no frontend |
| `ativo` | `is_active` | Direto | Boolean |
| `criado_em` | `created_at` | Direto | ISO timestamp |
| `atualizado_em` | `updated_at` | Direto | ISO timestamp |
| `estoque_atual` | `stock_quantity` | `estoque_atual \|\| 0` | Null → 0 |
| `apelido` | - | **USADO PARA `category`** | Heurística: `C/X/P` → `congelado` |
| `estoque_minimo` | `stock_min_alert` | `estoque_minimo \|\| 5` | Null → 5 |
| - | `description` | **GERADO** | `null` (não existe no DB) |
| - | `category` | **GERADO** | Heurística: `apelido` ou `codigo` |
| - | `weight_kg` | **GERADO** | Regex: `nome.match(/(\d+)kg/)` |
| - | `is_featured` | **GERADO** | Hardcoded: 3 produtos principais |
| - | `sort_order` | **GERADO** | `0` (não existe no DB) |

### Heurísticas Aplicadas

#### 1. Categoria (`category`)
```typescript
const isCongelado = produto.codigo.includes('congelado') 
                 || produto.apelido === 'C' 
                 || produto.apelido === 'X' 
                 || produto.apelido === 'P'

category: isCongelado ? 'congelado' : 'refrigerado'
```

#### 2. Peso (`weight_kg`)
```typescript
const weightMatch = produto.nome.match(/(\d+)kg/i)
const weight_kg = weightMatch ? parseFloat(weightMatch[1]) : 1.0
```

#### 3. Produtos em Destaque (`is_featured`)
```typescript
const is_featured = [
  'chipa_congelada_2kg',
  'palito_queijo_congelado_2kg',
  'pao_queijo_congelado_1kg'
].includes(produto.codigo)
```

### Campos Não Mapeados

**Do DB → Frontend:**
- `unidade` — Não usado no catálogo (sempre "kg" implícito)

**Do Frontend → DB:**
- `description` — Não existe no schema (sempre `null`)
- `sort_order` — Não existe no schema (sempre `0`)

### Exemplo de Mapeamento

**Entrada (DB):**
```json
{
  "id": "uuid-123",
  "nome": "Chipa Congelada 2kg",
  "codigo": "chipa_congelada_2kg",
  "preco": "60.00",
  "custo": "33.00",
  "unidade": "kg",
  "ativo": true,
  "estoque_atual": 20,
  "apelido": "C",
  "estoque_minimo": 5,
  "criado_em": "2024-01-01T00:00:00Z",
  "atualizado_em": "2024-01-01T00:00:00Z"
}
```

**Saída (Frontend):**
```json
{
  "id": "uuid-123",
  "name": "Chipa Congelada 2kg",
  "slug": "chipa-congelada-2kg",
  "description": null,
  "category": "congelado",
  "weight_kg": 2.0,
  "price_cents": 6000,
  "cost_cents": 3300,
  "stock_quantity": 20,
  "stock_min_alert": 5,
  "is_active": true,
  "is_featured": true,
  "sort_order": 0,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```
