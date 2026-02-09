# API Documentation v1
> **Base URL:** `/api` (Next.js API Routes) / `Supabase Client`

---

## 🛍️ Catálogo (Public)

### 1. Listar Produtos
Busca produtos ativos via View `vw_catalogo_produtos`.

**Source:** `supabase.from('vw_catalogo_produtos').select('*')`

**Response Object:**
```json
{
  "id": "uuid",
  "name": "Pão de Queijo 1kg",
  "slug": "pao-de-queijo-1kg",
  "price_cents": 3500,        // R$ 35,00
  "price_formatted": "35.00", // Legacy
  "stock_status": "Disponível",
  "primary_image_url": "https://...",
  "description": "...",
  "category": "Congelados",
  "weight_kg": 1.0,
  "is_featured": true
}
```

### 2. Criar Pedido
Registra um novo pedido no sistema.

**Endpoint:** `POST /api/pedidos`

**Payload:**
```json
{
  "customer": {
    "name": "João Silva",
    "phone": "5511999999999",
    "address": { ... } // Opcional
  },
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "price_cents": 3500
    }
  ],
  "delivery_method": "entrega" // ou 'retirada'
}
```

**Response:**
```json
{
  "pedido_id": "uuid",
  "numero_pedido": 123,
  "status": "pendente",
  "message": "Pedido criado com sucesso"
}
```

**Database Action:**
1. Inserts into `cat_pedidos`.
2. Inserts items into `cat_itens_pedido`.
3. Returns order identifiers.

---

## 📊 Admin (Private)

### 1. Dashboard KPIs
Busca métricas unificadas.

**Source:** `supabase.from('vw_admin_dashboard').select('*')`

**Response:**
```json
{
  "faturamento_hoje_cents": 15000,
  "pedidos_pendentes": 3,
  "produtos_estoque_baixo": 2
}
```

### 2. Marketing Performance
Busca vendas diárias (Online + Físico).

**Source:** `supabase.from('vw_marketing_pedidos').select('*')`

**Response:**
```json
[
  {
    "data_venda": "2026-02-09",
    "total_pedidos": 15,
    "faturamento_cents": 450000,
    "pedidos_online": 5,
    "pedidos_diretos": 10
  }
]
```
