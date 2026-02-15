# PROMPT FASE 1 — Diagnóstico da Animação Hero (Pão de Queijo Imersivo)

> **Workflow:** `/debug` → análise sistemática dos problemas visuais da hero animation
> **Agent:** `@frontend-specialist` (skills: clean-code, react-best-practices, frontend-design, tailwind-patterns)
> **Referências obrigatórias antes de começar:**
> - Ler `.agent/agents/frontend-specialist.md`
> - Ler `.agent/workflows/debug.md`
> - Ler `PROMPT_IMPLEMENTACAO_ANIMACAO_MONT.md` (spec original da animação)
> - Ler `PROMPT_CORRECAO_CHEESE_SIZE_E_FANTASMA.md` (correções anteriores)
> - Ler `.docs/ARCHITECTURE.md` e `.docs/CHANGELOG.md`

---

## Contexto

A hero section do Catálogo Mont é uma animação imersiva "Apple-like" de scroll controlado via GSAP ScrollTrigger. O usuário rola a página e um pão de queijo faz zoom, se abre ao meio revelando queijo derretido, e depois mergulha numa transição dourada até a seção de produtos.

### Arquitetura Atual

```
src/app/(public)/_components/hero/
├── ImmersiveHero.tsx      ← Orquestrador (monta tudo)
├── ScrollWrapper.tsx      ← Container 600vh + ScrollTrigger pin + HeroContext
├── HeroCopy.tsx           ← Título + CTA (fade out no scroll 8%-16%)
├── FloatingPaes.tsx       ← 6 pães decorativos (idle float + scatter 15%-25%)
├── PaoDeQueijo.tsx        ← Pão principal (zoom 15%-41% → split 39%-51% → cheese → dive 49%+)
└── DiveOverlay.tsx        ← Glow dourado (58%-70%) + transição creme (78%-90%)
```

**Stack:** Next.js 14 (App Router), TypeScript, GSAP 3.14.2 (ScrollTrigger), Tailwind CSS, Zustand

**Site ao vivo:** https://catalogo-mont.vercel.app

**Assets:** `/public/hero-cheese/` → `pao_left.png`, `pao_right.png`, `cheese.png`

---

## Sua Tarefa (FASE 1 — SOMENTE DIAGNÓSTICO)

> ⚠️ **NÃO ALTERE NENHUM ARQUIVO NESTA FASE.**
> Apenas analise, teste e reporte.

Preciso que você investigue **7 problemas visuais** identificados na animação hero. Para cada um:

1. **Confirme se o bug existe** — leia o código, rode `npm run dev`, teste no navegador
2. **Identifique a causa raiz** no código (arquivo, linha, propriedade)
3. **Avalie a severidade** (🔴 Crítico / 🟡 Médio / 🟢 Baixo)
4. **Proponha a correção** (sem implementar)

Use o formato `/debug` para o relatório.

---

## Os 7 Problemas a Investigar

### BUG 1: Faixa Marrom na Transição Hero → Produtos
**Severidade estimada:** 🔴 Crítico (visível para qualquer visitante)

**Sintoma:** Ao terminar a animação do hero e entrar na seção "Produtos em Destaque", aparece uma faixa retangular na cor `#3D2B22` (marrom escuro) entre a navbar e o conteúdo de produtos. Quebra completamente a ilusão de transição suave.

**Onde investigar:**
- `ScrollWrapper.tsx` → O wrapper de 600vh tem `bg-[#3D2B22]`. Quando o pin do ScrollTrigger libera, esse fundo aparece.
- `DiveOverlay.tsx` → O overlay de transição creme (`#FAF7F2`) deveria cobrir 100% da viewport no final, mas pode estar falhando em mascarar o fundo marrom.
- `HomeWrapper.tsx` → O `<main>` também tem `bg-[#3D2B22]` como cor inicial. Verificar se há conflito com o `FeaturedProducts` que espera fundo creme.
- Verificar se o `pinSpacing: false` no ScrollTrigger está causando cálculo errado de altura, fazendo o conteúdo pular.

**Perguntas-chave:**
- O overlay creme (`transitionRef` no DiveOverlay) chega a `opacity: 1` realmente no scroll 90%? Ou perde a corrida pro unpin?
- O que acontece com o z-index quando o pin é liberado? O conteúdo do ScrollWrapper some mas o fundo fica?
- O `HomeWrapper` muda sua cor de fundo (`#3D2B22` → `#FAF7F2`) cedo o suficiente, ou fica marrom até o primeiro ScrollTrigger de seção disparar?

---

### BUG 2: Navbar Descolando (Fundo Claro sobre Hero Escuro)
**Severidade estimada:** 🟡 Médio

**Sintoma:** Quando o scroll passa de 50px, a Navbar muda pra `bg-mont-cream/95 backdrop-blur-md`, criando uma barra clara no topo durante toda a animação do hero (que é escura). Isso cria uma divisão visual desagradável.

**Onde investigar:**
- `src/components/catalog/Navbar.tsx` → Linhas 85-87: `isScrolled ? 'bg-mont-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'`
- O threshold de 50px é muito baixo — a animação do hero ocupa 600vh de scroll. A navbar fica clara durante 95% da animação.

**Perguntas-chave:**
- Qual seria o threshold correto? Baseado no progresso do ScrollTrigger (ex: só mudar após 90% do hero)?
- Ou seria melhor a navbar ficar transparente durante todo o hero e só mudar quando a seção de produtos aparece?
- O `z-index` da Navbar é maior que o do ScrollWrapper pinnado? Há sobreposição?

---

### BUG 3: Conflito de Pinning (CSS `fixed` + ScrollTrigger `pin`)
**Severidade estimada:** 🔴 Crítico (causa bugs de scroll no iOS Safari)

**Sintoma:** No `ScrollWrapper.tsx`, o `contentRef` tem `className="fixed top-0 left-0"` (linha 61), mas o ScrollTrigger TAMBÉM aplica `pin: contentRef.current` (linha 40). É uma dupla-fixação.

**Onde investigar:**
- `ScrollWrapper.tsx` linhas 40 e 61
- Spec original: `PROMPT_IMPLEMENTACAO_ANIMACAO_MONT.md` linha 321: *"Não usar `position: fixed` diretamente — deixar o ScrollTrigger gerenciar o pinning via sua própria lógica."*

**O que testar:**
- Abrir no DevTools → Inspect o `contentRef` durante o scroll → Ele recebe `position: fixed` do GSAP E já tem `fixed` do CSS? Ou o GSAP detecta e ignora?
- Testar no Chrome vs Safari. O GSAP se comporta diferente com elementos já fixos?
- Verificar se removendo o `fixed top-0 left-0` da className e deixando apenas o ScrollTrigger pinnar, o comportamento muda.

---

### BUG 4: Transição Binária do Queijo (`display: none → block`)
**Severidade estimada:** 🟡 Médio

**Sintoma:** O queijo aparece de forma abrupta em vez de surgir gradualmente. No `PaoDeQueijo.tsx`:
- Linha 35: `timeline.set(cheeseRef, { display: 'none' })` no frame 0
- Linha 84: `timeline.set(cheeseRef, { display: 'block' })` no frame 39

`display` não é uma propriedade animável. O elemento simplesmente "materializa" de um frame pro outro.

**O que testar:**
- Fazer scroll lento na região 38%-40% e observar: o queijo faz fade-in ou simplesmente aparece?
- Se já há uma animação de `opacity: 0 → 1` (linha 89-93), será que o `display: none` está impedindo ela de funcionar? (Elementos com `display: none` não animam `opacity`)

**Proposta a avaliar:**
- Substituir `display: none/block` por `visibility: hidden/visible` + `opacity: 0` → `opacity: 1`
- Isso permite o GSAP animar a opacidade enquanto mantém o espaço no layout

---

### BUG 5: Overshooting do Zoom (Pão Ultrapassa a Viewport)
**Severidade estimada:** 🟡 Médio

**Sintoma:** O pão de queijo cresce além das bordas da tela durante o zoom. No `PaoDeQueijo.tsx`:
- Linha 18: `const targetH = window.innerHeight * 1.5` (150% da viewport)
- Spec original: `PROMPT_IMPLEMENTACAO_ANIMACAO_MONT.md` linha 159: `window.innerHeight * 0.95` (95%)

**O que testar:**
- Em diferentes viewports (375px, 768px, 1440px), o pão ultrapassa as bordas?
- O valor 1.5x foi intencional (pra garantir cobertura total antes do split) ou é bug?
- Se reduzir pra 0.95, o split ainda funciona visualmente? O queijo fica visível?

**Contexto:** O `1.5x` pode ter sido colocado pra compensar a falta de overflow no split — se o pão ocupar só 95%, as metades ao separar podem revelar gaps. Preciso que você avalie se o 1.5x é proposital ou se pode ser reduzido.

---

### BUG 6: Estiramento Excessivo do Queijo (`scaleX: 4.0` Hardcoded)
**Severidade estimada:** 🟢 Baixo (mais visível em telas pequenas)

**Sintoma:** O queijo estica 4x horizontalmente (linha 99 do `PaoDeQueijo.tsx`), o que em telas estreitas (375px) pode ultrapassar a viewport.

**O que testar:**
- No viewport de 375px, o queijo esticado vaza pra fora da tela?
- Considerando que o queijo está dentro do `sceneRef` (que já tem um scale massivo), o `scaleX: 4.0` se multiplica com o scale do pai?
- Verificar se a `maskImage` CSS (feathering das bordas) esconde o overflow ou se ele aparece.

---

### BUG 7: Texto Debug "Immersive Hero Active"
**Severidade estimada:** 🟢 Baixo (mas inaceitável em produção)

**Sintoma:** No `ImmersiveHero.tsx`, linhas 14-18:
```tsx
<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
    <div className="text-white/20 text-xs font-mono">
        Immersive Hero Active
    </div>
</div>
```

Esse texto aparece durante TODA a animação no site ao vivo.

**Ação:** Confirmar que é visível no https://catalogo-mont.vercel.app e recomendar remoção.

---

## Formato de Entrega Esperado

Para cada bug, use o formato `/debug`:

```markdown
## 🔍 Debug: [Nome do Bug]

### 1. Confirmação
✅ Confirmado / ❌ Não reproduzido / ⚠️ Parcialmente confirmado

### 2. Causa Raiz
🎯 **[Explicação técnica]**
- Arquivo: `[caminho]`
- Linha(s): [números]
- Propriedade: [o que está errado]

### 3. Severidade
[🔴/🟡/🟢] [Justificativa]

### 4. Proposta de Correção
```[linguagem]
// Antes
[código atual]

// Depois
[código proposto]
```

### 5. Impacto da Correção
- Arquivos afetados: [lista]
- Risco de quebrar outra coisa: [baixo/médio/alto]
- Dependências: [se depende de outro bug ser corrigido primeiro]
```

---

## Após o Diagnóstico

Depois de analisar todos os 7 bugs, me entregue:

1. **Relatório completo** no formato acima
2. **Ordem de prioridade** recomendada para correção (qual bug corrigir primeiro)
3. **Mapa de dependências** entre bugs (ex: "Bug 1 pode ser resolvido junto com Bug 3")
4. **Estimativa de risco** geral (quantos arquivos serão tocados, chance de regressão)
5. **Perguntas/dúvidas** que você tenha antes de eu aprovar a execução

> ⚠️ **REPITO: NÃO ALTERE CÓDIGO. Apenas diagnostique e reporte.**
> A Fase 2 (execução) será um prompt separado baseado no seu relatório.

---

## Checklist do PROMPT_IMPLEMENTACAO (Referência)

Itens ainda abertos que precisamos resolver:
- [ ] Configurar GSAP ScrollTrigger inicial e testar pinning na Home (Fase 1)
- [ ] Verificar performance (fps) no Chrome e Safari (Fase 6)
- [ ] Validar experiência Mobile — ajustar scales se necessário (Fase 6)
- [ ] Limpar código e remover arquivos antigos (Fase 6)

---

## Paleta de Cores Mont (Referência)

```
--mont-orange:        #E8601C   (CTAs, destaques)
--mont-orange-dark:   #C43E1A   (gradientes, sombras)
--mont-red-earth:     #8B2E1A   (camadas profundas)
--mont-gold:          #F5B731   (pão de queijo, badges)
--mont-gold-light:    #FACC42   (brilhos, hover)
--mont-brown-deep:    #3D2B22   (texto principal, fundos escuros)
--mont-gray-mountain: #6B6560   (texto secundário)
--mont-cream:         #FAF7F2   (background principal)
```
