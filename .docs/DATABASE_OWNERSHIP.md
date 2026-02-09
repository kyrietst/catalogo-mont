# Database Ownership & Structure
> **Last Updated:** 2026-02-09

## 1. Visão Geral
O banco de dados do Supabase atende a dois sistemas distintos que compartilham a mesma base:
1.  **Sistema Interno (Legado/Admin):** Gestão de vendas balcão, estoque, financeiro.
2.  **Catálogo Online (Novo):** E-commerce B2C/B2B via WhatsApp.

Para evitar conflitos de nomenclatura e responsabilidade, adotamos uma estratégia de **Extensão e Prefixos**.

---

## 2. Convenções de Nomenclatura

| Módulo | Prefixo | Idioma | Exemplo |
| :--- | :--- | :--- | :--- |
| **Sistema Interno** | (Nenhum) | Português | `produtos`, `vendas`, `contatos` |
| **Catálogo Online** | `cat_` | Português | `cat_pedidos`, `cat_itens_pedido` |
| **Compartilhado** | (Nenhum) | Português | `produtos`, `configuracoes` |

### Regras de Colunas
*   **Snake Case:** Sempre use `snake_case` (ex: `nome_cliente`, `data_criacao`).
*   **IDs:** Sempre UUID (`gen_random_uuid()`).
*   **Moeda:** Sempre armazenar como INTEGER (centavos) nas tabelas novas. Tabela legado `produtos` usa NUMERIC (reais).

---

## 3. Estrutura das Tabelas

### A. Módulo Compartilhado (Core)
Pertence ao Sistema Interno, mas é consumido pelo Catálogo.

*   `produtos`: Cadastro mestre.
    *   *Extendido pelo Catálogo com:* `slug`, `descricao`, `categoria`, `destaque`, `peso_kg`.

### B. Módulo Catálogo (`cat_*`)
Tabelas exclusivas para o funcionamento da loja online.

*   `cat_pedidos`: Pedidos realizados via site.
    *   Status: `pendente` -> `confirmado` -> `entregue`.
*   `cat_itens_pedido`: Itens de cada pedido online.
*   `cat_imagens_produto`: Galeria de fotos (url, ordem, principal).

### C. Módulo Sistema Interno (Legado)
Tabelas que o Catálogo NÃO toca (apenas leitura via views de BI).

*   `vendas`: Vendas diretas (balcão, telefone, ifood).
*   `itens_venda`: Itens das vendas diretas.
*   `contatos`: CRM básico.
*   `contas_receber`: Financeiro.

---

## 4. Views de Integração
As Views atuam como uma camada de abstração (Anti-Corruption Layer) para o Frontend do Catálogo, que espera uma estrutura em Inglês.

*   `vw_catalogo_produtos`: Traduz `produtos` (PT) -> API (EN).
    *   Ex: `nome` -> `name`, `preco` (Numeric) -> `price_cents` (Int).
*   `vw_marketing_pedidos`: Unifica `cat_pedidos` + `vendas` para KPIs.
*   `vw_admin_dashboard`: Consolida métricas de ambos os sistemas.

---

## 5. Política de Migrations
*   **Nunca** alterar nomes de colunas do Sistema Interno.
*   **Sempre** usar `IF NOT EXISTS` para criar tabelas/colunas novas.
*   **Sempre** prefixar novas tabelas com `cat_`.
