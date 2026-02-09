
# Application Routes

## Public Routes
- `/`: Home Page (Catalog)
- `/pedido/sucesso`: Order Success Page

## Admin Routes (Protected)
- `/admin`: Dashboard (KPIs, Overview)
- `/admin/login`: Login Page
- `/admin/produtos`: Product Management (List, Toggle Active, Inline Edit)
- `/admin/pedidos`: Order Management (Kanban/List status flow)

## API Routes
### Public
- `GET /api/pedidos`: Create new order
- `GET /api/public/produtos`: (Legacy/Optional) Public product list

### Admin (Protected)
- `GET /api/admin/produtos`: List all products (raw)
- `PATCH /api/admin/produtos/[id]`: Update product details
- `GET /api/admin/pedidos`: List all orders with items
- `PATCH /api/admin/pedidos/[id]`: Update order status
- `POST /api/auth/logout`: Sign out
