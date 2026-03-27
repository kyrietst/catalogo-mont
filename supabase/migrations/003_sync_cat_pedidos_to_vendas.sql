-- Sync automática: pedidos do catálogo → sistema interno (vendas)
-- Migration: 003_sync_cat_pedidos_to_vendas.sql
-- Descrição: Altera a RPC criar_pedido para, além de inserir em cat_pedidos + cat_itens_pedido,
--            criar automaticamente o registro espelho em vendas + itens_venda + contatos.
--            Se a sync falhar, o pedido do catálogo é preservado e o erro é registrado
--            em cat_pedidos_pendentes_vinculacao para retry manual.
--            Também salva campos de endereço individuais no contato.

CREATE OR REPLACE FUNCTION public.criar_pedido(
  p_nome_cliente text,
  p_telefone_cliente text,
  p_endereco_entrega text,
  p_metodo_entrega text,
  p_metodo_pagamento text,
  p_subtotal_centavos integer,
  p_frete_centavos integer,
  p_total_centavos integer,
  p_observacoes text DEFAULT NULL::text,
  p_indicado_por text DEFAULT NULL::text,
  p_itens jsonb DEFAULT '[]'::jsonb,
  p_cep text DEFAULT NULL,
  p_logradouro text DEFAULT NULL,
  p_numero text DEFAULT NULL,
  p_complemento text DEFAULT NULL,
  p_bairro text DEFAULT NULL,
  p_cidade text DEFAULT NULL,
  p_uf text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_pedido_id       UUID;
  v_numero_pedido   INTEGER;
  v_pedido          JSONB;
  v_item            JSONB;
  v_contato_id      UUID;
  v_venda_id        UUID;
  v_telefone_norm   TEXT;
  v_custo_unitario  NUMERIC;
  v_custo_total     NUMERIC := 0;
BEGIN
  -- ============================================================
  -- PARTE 1: Pedido do catálogo (CRÍTICA — não pode falhar)
  -- ============================================================

  -- 1. Insere o pedido principal
  INSERT INTO cat_pedidos (
    nome_cliente,
    telefone_cliente,
    endereco_entrega,
    metodo_entrega,
    metodo_pagamento,
    subtotal_centavos,
    frete_centavos,
    total_centavos,
    observacoes,
    indicado_por,
    status,
    status_pagamento
  )
  VALUES (
    p_nome_cliente,
    p_telefone_cliente,
    p_endereco_entrega,
    p_metodo_entrega,
    p_metodo_pagamento,
    p_subtotal_centavos,
    p_frete_centavos,
    p_total_centavos,
    p_observacoes,
    p_indicado_por,
    'pendente',
    'pendente'
  )
  RETURNING id, numero_pedido INTO v_pedido_id, v_numero_pedido;

  -- 2. Insere os itens do pedido
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_itens)
  LOOP
    INSERT INTO cat_itens_pedido (
      pedido_id,
      produto_id,
      nome_produto,
      quantidade,
      preco_unitario_centavos,
      total_centavos
    )
    VALUES (
      v_pedido_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_name',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'unit_price_cents')::INTEGER,
      (v_item->>'total_centavos')::INTEGER
    );
  END LOOP;

  -- ============================================================
  -- PARTE 2: Sync com sistema interno (TOLERANTE a falhas)
  -- Se falhar, o pedido do catálogo já foi salvo acima.
  -- O erro é registrado para retry manual.
  -- ============================================================
  BEGIN
    -- Normalizar telefone (só dígitos)
    v_telefone_norm := regexp_replace(p_telefone_cliente, '[^0-9]', '', 'g');

    -- Get-or-create contato pelo telefone normalizado
    SELECT id INTO v_contato_id
    FROM contatos
    WHERE regexp_replace(telefone, '[^0-9]', '', 'g') = v_telefone_norm
    LIMIT 1;

    IF v_contato_id IS NULL THEN
      -- Criar novo contato COM endereço
      INSERT INTO contatos (nome, telefone, tipo, status, origem,
                            endereco, cep, logradouro, numero, complemento, bairro, cidade, uf)
      VALUES (p_nome_cliente, v_telefone_norm, 'B2C', 'cliente', 'catalogo',
              p_endereco_entrega, p_cep, p_logradouro, p_numero, p_complemento, p_bairro, p_cidade, p_uf)
      RETURNING id INTO v_contato_id;
    ELSE
      -- Atualizar endereço do contato existente (só sobrescreve se novo valor não for null)
      UPDATE contatos SET
        endereco = COALESCE(p_endereco_entrega, endereco),
        cep = COALESCE(p_cep, cep),
        logradouro = COALESCE(p_logradouro, logradouro),
        numero = COALESCE(p_numero, numero),
        complemento = COALESCE(p_complemento, complemento),
        bairro = COALESCE(p_bairro, bairro),
        cidade = COALESCE(p_cidade, cidade),
        uf = COALESCE(p_uf, uf),
        atualizado_em = now()
      WHERE id = v_contato_id;
    END IF;

    -- Vincular contato ao pedido do catálogo
    UPDATE cat_pedidos
    SET contato_id = v_contato_id
    WHERE id = v_pedido_id;

    -- Inserir venda no sistema interno
    INSERT INTO vendas (
      contato_id,
      data,
      total,
      forma_pagamento,
      status,
      pago,
      valor_pago,
      taxa_entrega,
      origem,
      cat_pedido_id,
      observacoes
    )
    VALUES (
      v_contato_id,
      CURRENT_DATE,
      p_total_centavos / 100.0,
      p_metodo_pagamento,
      'pendente',
      false,
      0,
      p_frete_centavos / 100.0,
      'catalogo',
      v_pedido_id,
      p_observacoes
    )
    RETURNING id INTO v_venda_id;

    -- Inserir itens da venda com custo do produto
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_itens)
    LOOP
      SELECT COALESCE(custo, 0) INTO v_custo_unitario
      FROM produtos
      WHERE id = (v_item->>'product_id')::UUID;

      IF v_custo_unitario IS NULL THEN
        v_custo_unitario := 0;
      END IF;

      v_custo_total := v_custo_total + (v_custo_unitario * (v_item->>'quantity')::INTEGER);

      INSERT INTO itens_venda (
        venda_id,
        produto_id,
        quantidade,
        preco_unitario,
        subtotal,
        custo_unitario
      )
      VALUES (
        v_venda_id,
        (v_item->>'product_id')::UUID,
        (v_item->>'quantity')::INTEGER,
        (v_item->>'unit_price_cents')::INTEGER / 100.0,
        (v_item->>'total_centavos')::INTEGER / 100.0,
        v_custo_unitario
      );
    END LOOP;

    -- Atualizar custo total na venda
    UPDATE vendas SET custo_total = v_custo_total WHERE id = v_venda_id;

  EXCEPTION
    WHEN OTHERS THEN
      -- Sync falhou — registrar para retry manual
      -- O pedido do catálogo (Parte 1) permanece salvo normalmente
      INSERT INTO cat_pedidos_pendentes_vinculacao (cat_pedido_id, motivo_falha)
      VALUES (v_pedido_id, SQLERRM);
  END;

  -- ============================================================
  -- PARTE 3: Retorno
  -- ============================================================
  v_pedido := jsonb_build_object(
    'id', v_pedido_id,
    'numero_pedido', v_numero_pedido,
    'status', 'pendente',
    'total_centavos', p_total_centavos
  );

  RETURN v_pedido;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$function$;
