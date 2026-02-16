# Prompt para Agente — Setup de Imagens de Produto (Supabase)

## Contexto

Estamos migrando as imagens de produto da Mont Distribuidora de SVGs locais (`public/images/products/*.svg`) para Supabase Storage. As novas imagens já estão prontas e renomeadas na pasta `public/images/` da IDE.

O projeto Supabase é `herlvujykltxnwqmwmyx`.

---

## 1. Supabase Storage — Bucket

Crie o bucket `products` como **público** (public).

Faça o upload de todas as imagens da pasta `public/images/` para o bucket `products`.

As URLs finais seguirão o padrão:
```
https://herlvujykltxnwqmwmyx.supabase.co/storage/v1/object/public/products/{filename}
```

---

## 2. Convenção de Nomeação dos Arquivos

Os arquivos seguem este padrão:

```
{produto}-{peso}-{unidades}-{gramatura}-{tipo}.webp
```

Exemplo real:
```
pao-de-queijo-congelado-1kg-30un-30g-cover.webp
```

### Sufixos de tipo de imagem (`tipo`):

| Sufixo     | Descrição                                      | Uso                          |
|------------|-------------------------------------------------|------------------------------|
| `cover`    | Foto principal / capa do produto                | Card do catálogo (grid)      |
| `front`    | Frente da embalagem                             | Galeria da página do produto |
| `back`     | Verso (tabela nutricional, informações)         | Galeria da página do produto |
| `side`     | Lateral da embalagem                            | Galeria da página do produto |
| `label`    | Close no rótulo                                 | Galeria da página do produto |
| `detail`   | Textura / detalhe do produto (ex: queijo aberto)| Galeria da página do produto |
| `ambient`  | Foto no cenário de marca / lifestyle            | Galeria da página do produto |
| `pack`     | Embalagem fechada inteira                       | Galeria da página do produto |

---

## 3. Database — Tabela `cat_imagens_produto`

Verifique a estrutura atual da tabela `cat_imagens_produto`. Ela precisa ter **no mínimo** estas colunas:

```sql
CREATE TABLE IF NOT EXISTS cat_imagens_produto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'cover',
  alt_text TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index para busca rápida por produto
CREATE INDEX IF NOT EXISTS idx_cat_imagens_produto_produto_id 
  ON cat_imagens_produto(produto_id);

-- Index para filtrar por tipo (ex: buscar só covers para o grid)
CREATE INDEX IF NOT EXISTS idx_cat_imagens_produto_tipo 
  ON cat_imagens_produto(tipo);

-- Constraint: tipo deve ser um dos valores válidos
ALTER TABLE cat_imagens_produto 
  ADD CONSTRAINT chk_tipo_imagem 
  CHECK (tipo IN ('cover', 'front', 'back', 'side', 'label', 'detail', 'ambient', 'pack'));
```

### Explicação das colunas:

- **`produto_id`** — FK para a tabela `produtos`. Liga a imagem ao produto.
- **`url`** — URL completa do Supabase Storage.
- **`tipo`** — Tipo da imagem conforme tabela de sufixos acima. O frontend usa isso para saber qual imagem vai no card (`cover`) e quais vão no carrossel da página do produto (todas as demais).
- **`alt_text`** — Texto alternativo para acessibilidade e SEO. Ex: "Pão de queijo congelado 1kg - 30 unidades".
- **`ordem`** — Posição da imagem na galeria. A `cover` deve ser `ordem = 0`. As demais seguem a ordem que o cliente verá no carrossel.
- **`ativo`** — Flag para desativar uma imagem sem deletar do banco.

---

## 4. View `vw_catalogo_produtos`

Atualize a view `vw_catalogo_produtos` para incluir a imagem de capa corretamente. A view deve:

1. Trazer a URL da imagem com `tipo = 'cover'` como `imagem_principal` (para o grid do catálogo).
2. Opcionalmente, trazer um array/count de imagens adicionais (para a página do produto saber se tem galeria).

Exemplo de como a view pode incluir a imagem principal:

```sql
-- Dentro do SELECT da view, adicionar:
(
  SELECT url FROM cat_imagens_produto 
  WHERE cat_imagens_produto.produto_id = produtos.id 
    AND tipo = 'cover' 
    AND ativo = true 
  LIMIT 1
) AS imagem_principal
```

---

## 5. Inserção dos Dados

Após o upload das imagens pro bucket, insira os registros na tabela `cat_imagens_produto`.

Para cada imagem:
1. Identifique o `produto_id` correspondente na tabela `produtos` (pelo nome/SKU do produto).
2. Extraia o `tipo` do sufixo do nome do arquivo (a parte antes do `.webp`, depois do último `-`).
3. Monte a URL completa: `https://herlvujykltxnwqmwmyx.supabase.co/storage/v1/object/public/products/{filename}`
4. Gere um `alt_text` descritivo baseado no nome do arquivo.
5. Set `ordem = 0` para tipo `cover`, e incremente para os demais.

---

## 6. Cleanup

Após confirmar que as imagens do Supabase estão carregando corretamente no frontend:
- Remova os SVGs antigos de `public/images/products/`.
- Se houver `MOCK_PRODUCTS` ou qualquer fallback hardcoded com paths locais, atualize para usar as URLs do Supabase ou remova o fallback.

---

## 7. Verificação

Após executar tudo, confirme:
1. ✅ Bucket `products` existe e está público
2. ✅ Imagens acessíveis via URL direta no navegador
3. ✅ Tabela `cat_imagens_produto` com registros corretos
4. ✅ View `vw_catalogo_produtos` retornando `imagem_principal` com URL do Supabase
5. ✅ Frontend renderizando as imagens corretamente nos cards do catálogo

---

## Importante

- **NÃO altere a estrutura da tabela `produtos`** — as imagens ficam na tabela separada `cat_imagens_produto`.
- **Mantenha compatibilidade** com o `next/image` — as URLs do Supabase Storage precisam estar no `next.config.js` como domínio permitido para imagens (`images.remotePatterns`).
- Se o `next.config.js` ainda não tem o domínio do Supabase, adicione:

```js
// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'herlvujykltxnwqmwmyx.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```
