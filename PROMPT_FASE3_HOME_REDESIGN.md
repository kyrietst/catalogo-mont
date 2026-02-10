# FASE 3 — REDESIGN DA HOME (Parallax + GSAP + Identidade Visual Mont)

## CONTEXTO

A Home atual está funcional mas visualmente comum. Os problemas identificados:
1. `hero-bg.jpg` e `cta-bg.jpg` NÃO EXISTEM — Hero e CTA renderizam fundo sólido
2. 4 das 8 funções GSAP existem mas NÃO estão sendo usadas
3. Zero elementos decorativos, texturas ou assets visuais além dos SVGs de produto
4. Sem parallax multi-camada, sem elementos flutuantes, sem profundidade visual
5. No mobile (375px) não há menu hambúrguer — links somem completamente
6. `useScrollAnimation` está referenciado mas nunca foi criado
7. Seção BrandStory é texto estático sem animação

## OBJETIVO

Transformar a Home em uma experiência visual premium que reflete a identidade 
da Mont Distribuidora. O conceito visual é: pães de queijo flutuando em parallax 
com camadas de profundidade, animações suaves de scroll, transições de cor 
entre seções, e uma narrativa visual que guia o usuário do Hero ao CTA final.

## REFERÊNCIA DE MARCA (Brand Manual)

### Paleta de Cores (OBRIGATÓRIA)
```
--mont-orange:        #E8601C   (cor principal, CTAs, destaques)
--mont-orange-dark:   #C43E1A   (gradientes, sombras)
--mont-red-earth:     #8B2E1A   (camadas profundas)
--mont-gold:          #F5B731   (pão de queijo, badges premium)
--mont-gold-light:    #FACC42   (brilhos, hover)
--mont-brown-deep:    #3D2B22   (texto principal, fundos escuros)
--mont-gray-mountain: #6B6560   (texto secundário)
--mont-gray-light:    #A69E96   (bordas, divisores)
--mont-cream:         #FAF7F2   (background principal)
--mont-white-warm:    #FFFDF9   (cards, superfícies)
```

### Gradientes
```
Montanha:  linear-gradient(135deg, #E8601C 0%, #C43E1A 40%, #8B2E1A 70%, #6B6560 100%)
Dourado:   linear-gradient(180deg, #FACC42 0%, #F5B731 50%, #E8A020 100%)
Texto:     linear-gradient(180deg, #E8601C 0%, #C43E1A 100%)
```

### Tipografia
- Títulos: Playfair Display (já carregada no projeto)
- Corpo: DM Sans (já carregada)
- Preços: JetBrains Mono (já carregada)

### Tom Visual
- Artesanal premium (nem industrial, nem caseiro)
- Quente (laranjas, dourados, marrons — NUNCA frio/azul)
- Profundidade com camadas e parallax
- Movimento sutil e orgânico (não frenético)

---

## EXECUÇÃO — 6 TAREFAS SEQUENCIAIS

### TAREFA 1 — CRIAR ASSETS VISUAIS (SVG/CSS)

Como não temos fotos reais ainda, vamos criar elementos visuais com CSS e SVG 
que deem vida ao site sem depender de JPGs externos.

- [x] **1a) Criar `src/components/visual/FloatingCheesBread.tsx`:**
- Componente que renderiza um pão de queijo estilizado em CSS/SVG
- Formato: esfera dourada com gradiente radial (#FACC42 → #F5B731 → #E8A020)
- Textura sutil de furinhos (pode ser SVG pattern ou pseudo-elements)
- Sombra suave: `box-shadow: 0 20px 60px rgba(61, 43, 34, 0.3)`
- Props: `size` (sm/md/lg/xl), `className` para posicionamento
- Tamanhos: sm=40px, md=64px, lg=96px, xl=140px
- Deve ser leve (CSS puro ou SVG inline, sem imagens externas)

- [x] **1b) Criar `src/components/visual/MountainSilhouette.tsx`:**
- SVG da silhueta de montanhas inspirada no "M" da logo
- Dois picos com caminho sinuoso entre eles
- Cores: gradiente montanha (#E8601C → #8B2E1A → #6B6560)
- Versão para fundo do Hero (full-width, posicionada no bottom)
- Opacidade configurável para criar camadas de profundidade

- [x] **1c) Criar `src/components/visual/GrainTexture.tsx`:**
- Overlay de textura granulada sutil (CSS noise pattern)
- Adiciona profundidade artesanal a seções com fundo sólido
- `mix-blend-mode: overlay` + `opacity: 0.03-0.05`
- Componente wrapper: `<GrainTexture>{children}</GrainTexture>`

- [x] **1d) Criar `src/components/visual/ParticleField.tsx`:**
- Partículas flutuantes sutis (farinha no ar)
- CSS-only (keyframe animations em pseudo-elements)
- 8-12 partículas pequenas (2-4px) em branco/cream com opacidade baixa
- Movimento lento e orgânico (drift up/down, 15-25s por ciclo)
- SEM canvas, SEM JS pesado — apenas CSS animations

---

### TAREFA 2 — REDESIGN DO HERO SECTION

- [x] Reescrever completamente `src/app/(public)/_components/HeroSection.tsx`.

**Estrutura visual (camadas de trás pra frente):**

```
Camada 1 (fundo):     Gradiente escuro (#3D2B22 → #2C1810) + GrainTexture
Camada 2 (montanhas): MountainSilhouette no bottom, opacity 0.15
Camada 3 (partículas):ParticleField (farinha flutuando)
Camada 4 (pães):      6-8 FloatingCheeseBread em posições diferentes
Camada 5 (conteúdo):  Texto + botões (z-index mais alto)
```

**Parallax dos pães de queijo:**
- Usar GSAP ScrollTrigger para mover os pães em velocidades diferentes
- Pães maiores (lg/xl) movem devagar (parallax lento) — parecem mais perto
- Pães menores (sm/md) movem mais rápido — parecem mais longe
- Distribuição: 3-4 pães à esquerda, 3-4 à direita, nenhum no centro
- No mobile: reduzir para 4 pães, tamanhos menores, margins maiores
- USAR a função `parallaxImage` que já existe em animations.ts 
  (ou criar parallaxElement similar que funciona com qualquer elemento)

**Texto do Hero:**
- Headline: "Massa artesanal de pão de queijo" em Playfair Display
- Sub: "Do forno da Mont para a sua mesa" em DM Sans  
- USAR `heroTextReveal` que já existe (palavras revelando uma a uma)
- Após reveal do texto, os pães fazem uma animação sutil de "settle" 
  (pequeno bounce, como se pousassem)

**Scroll indicator:**
- Seta animada no bottom (já existe, manter)
- Ao scrollar, os pães começam a subir (parallax) enquanto 
  o conteúdo da próxima seção entra

**Mobile (375px):**
- Pães menores e menos visíveis (opacity reduzida)
- Texto centralizado, botões empilhados (já está assim)
- Montanhas SVG no bottom com height reduzido

---

### TAREFA 3 — ATIVAR ANIMAÇÕES GSAP DORMENTES

- [x] **3a) Ativar `sectionColorTransition`:**
- Aplicar na transição entre seções
- Hero (#3D2B22 escuro) → Destaques (#FAF7F2 cream) → Como Funciona (#F5F0E8 surface)
  → BrandStory (gradiente montanha sutil) → CTA (#3D2B22 escuro novamente)
- A transição deve ser suave (scroll-based, não abrupta)
- Aplicar no `<main>` ou em um wrapper das seções

- [x] **3b) Ativar `cartAddFeedback`:**
- Quando o usuário adicionar produto ao carrinho, o ícone do carrinho 
  na Navbar deve fazer a animação de "pulo"
- Conectar ao evento de addToCart no Zustand store
- Se a store dispara evento, o componente Navbar escuta e anima

- [x] **3c) Criar e implementar `useScrollAnimation` hook:**
```typescript
// src/hooks/useScrollAnimation.ts
// Hook reutilizável que aplica scrollReveal a um ref
// Uso: const ref = useScrollAnimation({ delay: 0.2, y: 30 })
// Retorna ref para aplicar no elemento
```
- Usar em BrandStory (que hoje não tem animação nenhuma)
- Usar nos cards de FeaturedProducts (em substituição ao scrollReveal direto)
- O hook deve fazer cleanup do ScrollTrigger no unmount

- [ ] **3d) Ativar `pageTransition`:**
- Se viável sem breaking changes, aplicar transição suave entre 
  / → /produtos e /produtos → /produtos/[slug]
- Se complexo demais, PULE esta — não é prioridade

---

### TAREFA 4 — CORRIGIR NAVBAR MOBILE

O menu mobile não tem hambúrguer — os links simplesmente desaparecem.

**Implementar:**
- [x] Botão hambúrguer visível apenas em mobile (md:hidden)
- [x] Menu slide-in da direita (ou overlay full-screen)
- [x] Links: Produtos, Sobre, Contato (WhatsApp)
- [x] Animação de abertura com GSAP (slide + fade, 0.3s)
- [x] Fechar ao clicar em link ou no X
- [x] Fundo overlay escuro semi-transparente
- [x] Design consistente com paleta Mont (fundo #3D2B22, links em #E8601C)

---

### TAREFA 5 — REDESIGN DO CTA FINAL

- [x] Reescrever `src/app/(public)/_components/FinalCTA.tsx`.

**Novo conceito:**
- [x] Fundo: gradiente escuro (#3D2B22 → #2C1810) + GrainTexture
- [x] 3-4 FloatingCheeseBread em parallax (espelhando o Hero, criando bookend visual)
- [x] MountainSilhouette no top (invertida, como se fechasse o ciclo)
- [x] Texto: "Pronto para experimentar o sabor artesanal?" em Playfair Display
- [x] Sub: "Peça agora e receba em casa" em DM Sans
- [x] Dois botões:
  - "Pedir pelo WhatsApp" (fundo #E8601C, ícone WhatsApp)
  - "Ver Catálogo Completo" (outline, borda #E8601C)
- [x] USAR `heroTextReveal` para animar o texto quando a seção entrar na viewport
- [x] Sem imagem JPG — os elementos visuais CSS/SVG fazem o trabalho

---

### TAREFA 6 — POLIMENTO E BUILD

- [x] **6a) Remover referências a imagens inexistentes:**
- Buscar: `grep -rn "hero-bg\|cta-bg" src/`
- Remover qualquer `background-image: url('/images/hero-bg.jpg')` 
  ou similar que ainda esteja no código
- Os novos componentes visuais substituem essas imagens

- [x] **6b) Ajustar BrandStory:**
- Adicionar `useScrollAnimation` para fade-in dos parágrafos
- Considerar adicionar um FloatingCheeseBread decorativo sutil 
  ao lado do texto (opacity 0.1, size xl, parallax lento)

- [x] **6c) Verificação de performance:**
```bash
# Medir tamanho dos novos componentes
du -sh src/components/visual/
# Garantir que tudo é CSS/SVG (nada de imagens pesadas)
find src/components/visual -name "*.jpg" -o -name "*.png" -o -name "*.webp"
# Deve retornar vazio
```

- [x] **6d) Documentação:**
- Atualizar `.docs/COMPONENTS.md` com os 4 novos componentes visuais
- Atualizar `.docs/CHANGELOG.md` com a sessão de redesign
- Adicionar ao CHANGELOG: quais animações GSAP foram ativadas

- [ ] **6e) Build final:**
```bash
npm run build
```
- DEVE passar com 0 erros
- Confirmar que TODAS as rotas dinâmicas aparecem como ƒ (Dynamic)

---

## REGRAS INEGOCIÁVEIS

1. **ZERO imagens externas** — tudo é CSS, SVG inline, ou componentes React
2. **Mobile-first 375px** — testar cada componente nesse breakpoint primeiro
3. **Performance** — os pães flutuantes usam `will-change: transform` e 
   `transform: translate3d()` para GPU acceleration
4. **Acessibilidade** — elementos decorativos têm `aria-hidden="true"`
5. **GSAP cleanup** — todo ScrollTrigger deve ter `.kill()` no cleanup do useEffect
6. **Paleta da marca** — APENAS cores do Brand Manual. Se inventar cor, está errado
7. **Não quebrar funcionalidade existente** — carrinho, checkout WhatsApp, 
   API de pedidos, admin panel devem continuar funcionando
8. **Build deve passar** — npm run build com 0 erros, 0 warnings de tipo

## ORDEM DE EXECUÇÃO

- [x] 1. Criar 4 componentes visuais (FloatingCheeseBread, MountainSilhouette, 
   GrainTexture, ParticleField)
- [x] 2. Redesign HeroSection com parallax multi-camada
- [x] 3. Corrigir Navbar mobile (hambúrguer)
- [x] 4. Ativar sectionColorTransition + cartAddFeedback
- [x] 5. Criar useScrollAnimation hook
- [x] 6. Aplicar useScrollAnimation em BrandStory
- [x] 7. Redesign FinalCTA
- [x] 8. Remover referências a hero-bg.jpg e cta-bg.jpg
- [x] 9. Atualizar .docs/ (COMPONENTS.md + CHANGELOG.md)
- [x] 10. npm run build (0 erros)
- [x] 11. Testar em 375px (visualmente descrever o resultado)

## COMMIT FINAL

```
feat: home redesign — parallax cheese bread, GSAP animations, mobile nav

- Add floating cheese bread parallax elements (CSS/SVG only)
- Add mountain silhouette, grain texture, particle field components  
- Redesign HeroSection with multi-layer parallax
- Redesign FinalCTA with visual elements
- Activate sectionColorTransition and cartAddFeedback GSAP animations
- Create useScrollAnimation hook
- Fix mobile navbar (add hamburger menu)
- Remove references to missing hero-bg.jpg and cta-bg.jpg
- Update .docs/ documentation
```
