# PROMPT DE IMPLEMENTAÇÃO — Animação Imersiva "Apple-Like" do Pão de Queijo

## Contexto

Você acabou de analisar o `HeroSectionTeste.tsx` e identificou 4 falhas críticas e problemas técnicos. Agora vamos refatorar completamente a animação baseado nas suas recomendações e na especificação abaixo.

Sua análise confirmou:
- ❌ Não existe efeito de profundidade no eixo Z
- ❌ O pão não domina a viewport (ocupa só 60-80%)
- ❌ Não existe transição de mergulho para a próxima seção
- ⚠️ As 3 imagens são independentes (sem wrapper de grupo)
- ⚠️ O scroll de 150% é curto demais para 3+ fases complexas
- ⚠️ Os textos não desaparecem durante o zoom

Vamos resolver tudo isso.

---

## Arquitetura da Refatoração

### Decisão: Reescrever, não remendar

O código atual tem problemas estruturais demais para um patch. A abordagem correta é:
1. Criar os novos componentes lado a lado (sem apagar o `HeroSectionTeste.tsx` ainda)
2. Montar a nova animação completa
3. Testar e validar
4. Substituir o componente antigo pelo novo

### Estrutura de Componentes

```
components/
  hero/
    ImmersiveHero.tsx          ← Componente principal (orquestra tudo)
    HeroCopy.tsx               ← Título + subtítulo + CTA (faz fade out no Ato 2)
    FloatingPaes.tsx           ← Os pães pequenos que flutuam em idle e dispersam
    PaoDeQueijo.tsx            ← O pão principal (wrapper das metades + interior)
    CheeseStrings.tsx          ← Fios de queijo + gotas
    DiveOverlay.tsx            ← Glow dourado + transição para creme
    ScrollWrapper.tsx          ← Container com scroll total + pin
```

---

## Especificação Técnica por Componente

### ScrollWrapper.tsx

```tsx
// Responsabilidades:
// - Criar o container de scroll total (600vh de altura)
// - Pinnar a viewport durante toda a animação
// - Expor a timeline master para os componentes filhos

// O wrapper tem 600vh de altura total
// A viewport (100vh) fica pinnada do início ao fim
// Isso dá "espaço de scroll" suficiente para controlar 5 fases

// ScrollTrigger config:
// trigger: o wrapper de 600vh
// start: 'top top'
// end: 'bottom bottom'
// pin: a viewport interna de 100vh
// pinSpacing: false
// scrub: 1.2 (suavidade no acompanhamento do scroll)
```

**Cleanup obrigatório:**
```tsx
useEffect(() => {
  // ... setup GSAP
  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
    // kill timeline também
  };
}, []);
```

### HeroCopy.tsx

```tsx
// Conteúdo:
// - h1: "O sabor que só o artesanal tem" (Montserrat Black, clamp(2.2rem, 7vw, 4.5rem))
//   - "artesanal" tem gradient text: linear-gradient(135deg, #E8601C, #C43E1A)
// - p: "Massa natural de pão de queijo..." (DM Sans, cor #6B6560)
// - CTA: "Peça pelo WhatsApp" (bg #E8601C, text white, border-radius 100px)
// - Scroll hint no bottom: "Role para descobrir" + seta animada

// Animação (controlada pelo parent via ref):
// - Fade out: opacity 1→0, y 0→-50px
// - Timing: scroll 10%→16%
// - Ease: power2.in
// - O scroll hint desaparece primeiro (scroll 8%→12%)
```

### FloatingPaes.tsx

```tsx
// 6 pães de queijo pequenos, posicionados ao redor da hero
// Cada um com tamanho e posição diferentes

// IDLE ANIMATION (contínua, não vinculada ao scroll):
// gsap.to(pao, {
//   y: `${8 + i * 4}px`,
//   x: `${4 + i * 2}px`,
//   rotation: (i % 2 === 0) ? 4 : -4,
//   duration: 2.5 + i * 0.4,
//   ease: 'sine.inOut',
//   yoyo: true,
//   repeat: -1
// });

// SCATTER ANIMATION (vinculada ao scroll):
// Timing: scroll 15%→25%
// Cada pão vai para uma direção diferente:
//   pao1: { x: -300, y: -250, opacity: 0, scale: 0.3 }
//   pao2: { x: 350, y: -200, opacity: 0, scale: 0.3 }
//   pao3: { x: -400, y: 150, opacity: 0, scale: 0.2 }
//   pao4: { x: 380, y: 200, opacity: 0, scale: 0.2 }
//   pao5: { x: -200, y: -300, opacity: 0, scale: 0.2 }
//   pao6: { x: 250, y: -280, opacity: 0, scale: 0.2 }
// Ease: power2.out
// Duration: 0.10 cada (stagger natural pela posição no timeline)

// Visual de cada pão (CSS):
// border-radius: 50%
// background: radial-gradient(ellipse at 35% 30%,
//   #F5D78E 0%, #E8B84D 35%, #C4942E 70%, #A07020 100%)
// box-shadow: 0 6px 20px rgba(139,46,26,0.12),
//   inset 0 -3px 8px rgba(139,46,26,0.15),
//   inset 0 3px 6px rgba(255,230,170,0.25)
// ::before pseudo-element para highlight de luz (top-left, white blur)
```

### PaoDeQueijo.tsx — O COMPONENTE MAIS IMPORTANTE

```tsx
// Este é o pão principal que faz o zoom e split.
// Estrutura DOM:

// <div ref={sceneRef} className="pao-scene">  ← WRAPPER que recebe o scale
//   <div ref={crustLeftRef} className="half crust-left" />   ← Crust esquerda
//   <div ref={crustRightRef} className="half crust-right" /> ← Crust direita
//   <div ref={innerLeftRef} className="half inner-left" />   ← Interior esquerdo
//   <div ref={innerRightRef} className="half inner-right" /> ← Interior direito
// </div>

// TAMANHO INICIAL: 30vmin x 30vmin (mobile: 40vmin x 40vmin)
// Posição: absolute, centralizado (top 50%, left 50%, translate -50% -50%)

// ============================================
// FASE ZOOM (Ato 2) — scroll 15%→40%
// ============================================
// Calcular scale dinamicamente:
//
// function getFullscreenScale() {
//   const pao = sceneRef.current;
//   const currentH = pao.offsetHeight;
//   const targetH = window.innerHeight * 0.95;
//   const targetW = window.innerWidth * 0.95;
//   const target = Math.max(targetH, targetW);
//   return target / currentH;
// }
//
// gsap.fromTo(sceneRef, { scale: 1 }, {
//   scale: () => getFullscreenScale(),
//   duration: 0.25,  // relativo à timeline (25% do scroll total)
//   ease: 'power2.inOut',
//   invalidateOnRefresh: true  // CRÍTICO: recalcula no resize
// });
//
// O pão deve ir de 30vmin até cobrir 95% da viewport.
// Em um monitor 1920x1080 com 30vmin = ~324px, o scale seria ~3.15
// Em mobile 390x844 com 40vmin = ~156px, o scale seria ~5.1
// invalidateOnRefresh cuida disso automaticamente.

// ============================================
// FASE SPLIT (Ato 3) — scroll 40%→60%
// ============================================

// 1. Revelar interior (opacity 0→1):
// gsap.to([innerLeftRef, innerRightRef], { opacity: 1, duration: 0.02 });

// 2. Metade esquerda desliza:
// gsap.to(crustLeftRef, { x: '-30%', duration: 0.18, ease: 'power3.out' });
// gsap.to(innerLeftRef, { x: '-30%', duration: 0.18, ease: 'power3.out' });

// 3. Metade direita desliza:
// gsap.to(crustRightRef, { x: '30%', duration: 0.18, ease: 'power3.out' });
// gsap.to(innerRightRef, { x: '30%', duration: 0.18, ease: 'power3.out' });

// CSS das metades:
// .crust-left {
//   clip-path: polygon(0 0, 52% 0, 52% 100%, 0 100%);
//   background: radial-gradient(ellipse at 40% 35%,
//     #F5D78E 0%, #E8B84D 25%, #D4A030 45%, #C4942E 65%, #A07020 100%);
//   box-shadow: inset 0 -6px 20px rgba(100,60,20,0.25),
//               inset 0 6px 12px rgba(255,230,170,0.2);
// }
// .crust-left::before = highlight luz (top-left, white blur)
// .crust-left::after = rachaduras sutis (linhas finas, rotate)
//
// .crust-right = espelhado (clip-path invertido, gradiente do outro lado)
//
// .inner-left / .inner-right:
//   background: radial-gradient(ellipse at 55% 50%,
//     #FFF0C8 0%, #F5E0A0 20%, #E8C860 45%, #D4A840 70%, #C4942E 100%)
//   + ::after com dots de textura (furinhos de queijo):
//     background-image: radial-gradient(circle at 25% 30%, rgba(196,148,46,0.2) 2px, transparent 2px),
//                        radial-gradient(circle at 60% 20%, rgba(196,148,46,0.15) 3px, transparent 3px),
//                        etc...

// ============================================
// FASE DIVE (Ato 4) — scroll 62%→84%
// ============================================
// gsap.to(sceneRef, {
//   scale: () => getFullscreenScale() * 4,  // 4x além do fullscreen
//   duration: 0.22,
//   ease: 'power2.in',
//   invalidateOnRefresh: true
// });
```

**NOTA IMPORTANTE SOBRE FUTURO:**
Quando tivermos os renders 3D do Blender, os shapes CSS serão substituídos por `<Image>`. A estrutura do componente deve facilitar isso — idealmente, a crust-left e crust-right podem receber uma prop `imageSrc` opcional que, quando presente, renderiza um `<Image>` em vez do gradient CSS.

### CheeseStrings.tsx

```tsx
// Container: absolute, inset 0, z-index abaixo das metades do pão
// 7 fios de queijo + 4 gotas

// Cada fio é um div absoluto com:
// - width: 100%
// - height variável (3px a 8px, o central é mais grosso)
// - top variável (distribuído de 25% a 72% vertical)
// - background: linear-gradient horizontal com transparência nas pontas:
//   transparent 5% → #FACC42 20% → #F5B731 50% → #FACC42 80% → transparent 95%
// - Animação: opacity 0→1, scaleX 0→1, transform-origin: center
// - Timing: scroll 44%→58%
// - Stagger: 0.012 entre cada fio
// - Ease: power2.out

// Gotas:
// - width: 8-16px
// - background: linear-gradient(180deg, #FACC42, #F5B731 60%, rgba(245,183,49,0.3))
// - border-radius: 50% 50% 50% 50% / 30% 30% 70% 70% (forma de gota)
// - Animação: opacity 0→0.85, height 0→25px (cresce para baixo)
// - Timing: scroll 55%→65%
// - Stagger: 0.02

// DIVE: Na fase de mergulho, o cheese layer inteiro escala 3x e faz opacity→0.4
// gsap.to(cheeseLayerRef, { scale: 3, opacity: 0.4, duration: 0.20, ease: 'power2.in' });
```

### DiveOverlay.tsx

```tsx
// Duas camadas de overlay:

// 1. Golden Glow (z-index acima do cheese, abaixo da UI)
//   - background: radial-gradient(ellipse at 50% 50%,
//       rgba(250,204,66,0.5) 0%, rgba(245,183,49,0.3) 30%, transparent 60%)
//   - Timing aparição: scroll 58%→70% (opacity 0→1)
//   - Timing intensificação: scroll 68%→78%:
//       background muda para: radial-gradient(ellipse at 50% 50%,
//         rgba(250,204,66,0.7) 0%, rgba(250,247,242,1) 80%)

// 2. Transition Overlay (z-index acima de tudo)
//   - background: #FAF7F2 (creme sólido)
//   - opacity: 0→1
//   - Timing: scroll 78%→90%
//   - Ease: power3.in
//   - Quando opacity chega a 1, a tela está completamente creme
//     = pronta para a seção de produtos

// Cleanup: golden glow faz opacity→0 no scroll 88%
```

---

## Timeline Master — Mapa Visual de Timing

```
SCROLL %    0    10   15   20   25   30   35   40   45   50   55   60   65   70   75   80   85   90   95   100
            │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │
HERO COPY   ████████──────▓▓░░                                                                          
SCROLL HINT ██████──▓▓░░                                                                                
FLOAT PAES  ████████████──────▓▓▓▓░░░░                                                                  
PAO ZOOM    │    │    ████████████████████████████████                                                   
            │    │    │(scale 1)              (scale fullscreen)                                          
INNER REVEAL│    │    │    │    │    │    │    ██                                                        
SPLIT       │    │    │    │    │    │    │    │  ██████████████████                                      
CHEESE STRS │    │    │    │    │    │    │    │    ████████████████████████                              
CHEESE DRIP │    │    │    │    │    │    │    │    │    │    ████████████                                
GOLD GLOW   │    │    │    │    │    │    │    │    │    │    │  ████████████████                         
PAO DIVE    │    │    │    │    │    │    │    │    │    │    │    │  ██████████████████████               
CHEESE DIVE │    │    │    │    │    │    │    │    │    │    │    │  ████████████████████                 
GLOW INTENS │    │    │    │    │    │    │    │    │    │    │    │    │  ████████████████                
TRANSITION  │    │    │    │    │    │    │    │    │    │    │    │    │    │    │  ████████████          
CLEANUP     │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    ████████        
PRODUCTS    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │  ████████████

LEGENDA: ████ = ativo   ▓▓ = transição   ░░ = fade out
```

---

## Regras de Performance

1. **SÓ animar `transform` e `opacity`**. Nunca `width`, `height`, `top`, `left`, `margin`, `padding`. Essas propriedades trigam layout recalculation e causam jank.

2. **`will-change: transform`** nos elementos que serão animados intensamente (pao-scene, cheese-layer, overlays). Mas remover quando a animação terminar para liberar memória da GPU.

3. **`invalidateOnRefresh: true`** em qualquer animação que depende de dimensões calculadas (o scale do pão).

4. **`scrub: 1.2`** na timeline master para suavidade no acompanhamento do scroll (1.2 segundos de delay entre scroll e animação). Isso evita que a animação pareça "grudada" no dedo/mouse.

5. **Testar em mobile** com touch scroll. O GSAP ScrollTrigger lida com touch nativamente, mas verificar se o `pin` não causa bugs de scroll bounce no iOS Safari.

6. **Não usar `position: fixed`** diretamente — deixar o ScrollTrigger gerenciar o pinning via sua própria lógica.

---

## Ordem de Execução

```
PASSO 1: ScrollWrapper + Pin
  → Confirmar que 600vh de scroll funciona e a viewport fica pinnada
  → Testar em desktop e mobile

PASSO 2: HeroCopy + FloatingPaes (Ato 1)
  → Hero estática com idle animation nos pães flutuantes
  → Confirmar visual e posicionamento

PASSO 3: PaoDeQueijo — Zoom (Ato 2)
  → Fade do copy + scatter dos pães + zoom do pão até fullscreen
  → VALIDAR que o scale dinâmico funciona em diferentes viewports
  → Este é o passo mais crítico, se o zoom não ficar bom, nada funciona

PASSO 4: PaoDeQueijo — Split (Ato 3)
  → Abertura das metades + reveal do interior
  → Validar que o clip-path funciona em todos os browsers

PASSO 5: CheeseStrings (Ato 3 continuação)
  → Fios de queijo + gotas
  → Coordenar timing com o split

PASSO 6: DiveOverlay (Ato 4)
  → Mergulho + glow + transição
  → Validar que a transição para creme fica suave

PASSO 7: ProductsSection (Ato 5)
  → Cards emergindo com stagger
  → ScrollTrigger independente

PASSO 8: Refinamento final
  → Ajustar todos os timings
  → Testar mobile
  → Testar performance (devtools > Performance tab)
```

**IMPORTANTE:** A cada passo, faça commit e teste antes de avançar. Não implemente tudo de uma vez.

---

## Sobre as Imagens Atuais

O `HeroSectionTeste.tsx` atual usa 3 imagens separadas (pão esquerdo, pão direito, queijo). Na nova implementação:

- **Por enquanto:** Usar CSS puro (gradientes + box-shadow + pseudo-elements) para representar o pão de queijo. Isso permite iterar rápido sem depender de assets.
- **Futuro próximo:** Substituir por renders 3D do Blender (frames PNG de alta resolução) ou fotos reais do produto.
- **Design do componente:** O `PaoDeQueijo.tsx` deve aceitar uma prop opcional `useImages?: boolean` e/ou `imageSrcs?: { crustLeft: string, crustRight: string, innerLeft: string, innerRight: string }` para facilitar a troca futura.

Se quiser manter as imagens atuais durante a transição, elas podem ser usadas dentro dos clip-paths das metades como `background-image` em vez dos gradientes CSS.

---

## 📝 Checklist de Implementação

Use este checklist para marcar o progresso conforme avançamos.

### 🏗️ Fase 1: Estrutura & Setup
- [x] Criar arquivo `components/hero/ScrollWrapper.tsx` (Container 600vh + Pin)
- [x] Criar arquivo `components/hero/ImmersiveHero.tsx` (Orquestrador)
- [ ] Configurar GSAP ScrollTrigger inicial e testar pinning na Home

### 🎨 Fase 2: Elementos Iniciais (Ato 1)
- [x] Criar `components/hero/HeroCopy.tsx` (Título, Subtítulo, CTA)
- [x] Implementar animação de Fade Out do Copy no scroll
- [x] Criar `components/hero/FloatingPaes.tsx` (6 pães com idle animation)
- [x] Implementar Scatter Animation (explosão) dos pães flutuantes

### 🔍 Fase 3: O Protagonista (Ato 2 - Zoom)
- [x] Criar `components/hero/PaoDeQueijo.tsx` (Wrapper + Metades + Miolo)
- [x] Implementar lógica de `getFullscreenScale()`
- [x] Configurar animação de **Zoom** (Scroll 15% -> 40%)
- [x] **VALIDAÇÃO CRÍTICA**: O zoom funciona responsivamente?

### ✂️ Fase 4: O Recheio (Ato 3 - Split)
- [x] Implementar shapes CSS das metades (Crust/Inner)
- [x] Configurar animação de **Split** (Scroll 40% -> 60%)
- [x] Criar `components/hero/CheeseStrings.tsx` (Fios de queijo)
- [x] Animar fios esticando e gotas caindo

### 🏊 Fase 5: O Mergulho (Ato 4 - Dive)
- [x] Criar `components/hero/DiveOverlay.tsx`
- [x] Implementar **Golden Glow** e transição para cor creme
- [x] Configurar animação de **Dive** (Scale 4x + Opacity)
- [x] Conectar transição visual com a próxima seção (`ProductsSection`)

### 🏁 Fase 6: Polimento & Integração
- [ ] Substituir `HeroSectionTeste` por `ImmersiveHero` na página principal
- [ ] Verificar performance (fps) no Chrome e Safari
- [ ] Validar experiência Mobile (ajustar scales se necessário)
- [ ] Limpar código e remover arquivos antigos
