
# Database Ownership & Permissions

## `produtos` Table
- **Source of Truth**: Internal System (Legacy)
- **Read Access**: Public Catalog, Admin Panel
- **Write Access**:
  - **Internal System**: `nome`, `preco`, `estoque_atual`, `estoque_minimo` (Master)
  - **Admin Panel**: `ativo` (Toggle visibility), `descricao`, `categoria`, `peso_kg`, `destaque`, `slug`
  - **Constraints**: Admin Panel MUST NOT modify Master fields.

## `cat_pedidos` Table
- **Source of Truth**: Catalog App
- **Write Access**:
  - **Public**: Insert new orders
  - **Admin Panel**: Update `status`

## `cat_imagens_produto` Table
- **Source of Truth**: Catalog App (Static S3/Storage references)
- **Write Access**: Admin Panel (Future) / Manual Insert
