# PROMPT FASE 2 — Execução das Correções da Hero Animation

> **Workflow:** `/enhance` → correções iterativas com teste visual entre batches
> **Agent:** `@frontend-specialist` (skills: clean-code, frontend-design, tailwind-patterns, nextjs-react-expert)
> **Referências obrigatórias antes de começar:**
> - Ler `.agent/agents/frontend-specialist.md` + skills do frontmatter
> - Ler `PROMPT_IMPLEMENTACAO_ANIMACAO_MONT.md` (spec original)
> - Ler `RELATORIO_FASE1_DIAGNOSTICO.md` (diagnóstico completo)
> - Ler `.docs/ARCHITECTURE.md`

---

## Contexto

Este prompt é a **Fase 2 (execução)** baseada no diagnóstico da Fase 1. Foram identificados 7 bugs visuais na hero animation do Catálogo Mont. As decisões do dono do projeto foram:

| Decisão | Resposta |
|---------|----------|
| Zoom 1.5x → | Testar com **1.1x** como compromisso |
| Mover DiveOverlay pra fora do ScrollWrapper | **Sim, aprovado** |
| Navbar durante o hero | **Transparente total**, sólida só após produtos |
| Teste iOS Safari | Apenas simulador disponível |
| `invalidateOnRefresh: true` | **Sim, adicionar** |

---

## Regras de Execução

1. **Implementar em 4 batches** na ordem abaixo
2. **Após cada batch:** rodar `npm run dev`, testar scroll completo (ida e volta), verificar console
3. **Commit atômico por batch** com mensagem descritiva
4. **Se um batch quebrar algo:** reverter e reportar antes de continuar
5. **Não tocar em arquivos fora do escopo** de cada batch

---

## BATCH 1 — Quick Wins (Zero Risco)

### 1A. Remover texto debug do ImmersiveHero

**Arquivo:** `src/app/(public)/_components/hero/ImmersiveHero.tsx`

Deletar linhas 13-18 (o bloco inteiro do debug):

```tsx
// DELETAR TUDO ISSO:
{/* Visual Debugging - Will be removed later */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
    <div className="text-white/20 text-xs font-mono">
        Immersive Hero Active
    </div>
</div>
```

O componente final fica:

```tsx
export default function ImmersiveHero() {
    return (
        <ScrollWrapper>
            {/* Background */}
            <div className="absolute inset-0 bg-[#3D2B22]" />

            <HeroCopy />
            <FloatingPaes />
            <PaoDeQueijo />
            <DiveOverlay />
        </ScrollWrapper>
    )
}
```

---

### 1B. Substituir `display: none/block` por `visibility` no PaoDeQueijo

**Arquivo:** `src/app/(public)/_components/hero/PaoDeQueijo.tsx`

**Mudança 1 — Estado inicial (linha 31-36):**

```tsx
// ANTES:
timeline.set(cheeseRef.current, {
    opacity: 0,
    scaleX: 0.1,
    scaleY: 0.1,
    display: 'none'
}, 0)

// DEPOIS:
timeline.set(cheeseRef.current, {
    opacity: 0,
    scaleX: 0.1,
    scaleY: 0.1,
    visibility: 'hidden',
    pointerEvents: 'none'
}, 0)
```

**Mudança 2 — Reveal do queijo (linha 84-88):**

```tsx
// ANTES:
timeline.set(cheeseRef.current, {
    display: 'block',
    scaleX: 1.0,
    scaleY: 0.6
}, 39)

// DEPOIS:
timeline.set(cheeseRef.current, {
    visibility: 'visible',
    pointerEvents: 'auto',
    scaleX: 1.0,
    scaleY: 0.6
}, 39)
```

**Validação Batch 1:**
- [ ] Site roda sem erros no console
- [ ] Texto "Immersive Hero Active" não aparece mais
- [ ] Scroll completo funciona ida e volta
- [ ] Queijo ainda aparece no momento certo (região 39%)
- [ ] `npm run build` passa sem erros

**Commit:** `fix: remove debug text and replace display:none with visibility:hidden in cheese animation`

---

## BATCH 2 — Pinning + Transição (Crítico, Interdependente)

> ⚠️ Este batch mexe no core do scroll system. Testar extensivamente após cada sub-etapa.

### 2A. Remover `fixed` do CSS no ScrollWrapper

**Arquivo:** `src/app/(public)/_components/hero/ScrollWrapper.tsx`

**Mudança na linha 61:**

```tsx
// ANTES:
<div ref={contentRef} className="fixed top-0 left-0 w-full h-screen overflow-hidden">

// DEPOIS:
<div ref={contentRef} className="w-full h-screen overflow-hidden">
```

**Adicionar `invalidateOnRefresh` no ScrollTrigger (linha 36-44):**

```tsx
// ANTES:
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: contentRef.current,
        pinSpacing: false,
        scrub: 1.2,
        onUpdate: (self) => setScrollProgress(self.progress)
    }
})

// DEPOIS:
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: contentRef.current,
        pinSpacing: false,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => setScrollProgress(self.progress)
    }
})
```

**Também adicionar `data-hero-wrapper` ao wrapper div (linha 60) — será necessário para o Batch 2B:**

```tsx
// ANTES:
<div ref={wrapperRef} className="relative w-full h-[600vh] bg-[#3D2B22]">

// DEPOIS:
<div ref={wrapperRef} data-hero-wrapper className="relative w-full h-[600vh] bg-[#3D2B22]">
```

**⚠️ PARAR E TESTAR AQUI.** Verificar:
- O pin do ScrollTrigger funciona normalmente sem o `fixed` CSS?
- Há flash/salto no primeiro load?
- O scroll completo (ida e volta) funciona?
- Se houver flash, adicionar ao contentRef: `style={{ willChange: 'transform' }}`

---

### 2B. Criar HeroTransition (overlay creme FORA do pin)

**Novo arquivo:** `src/app/(public)/_components/hero/HeroTransition.tsx`

Este componente substitui a parte de transição creme que antes estava dentro do DiveOverlay. Ele fica **fora** do ScrollWrapper (não é filho do conteúdo pinnado), então sobrevive ao unpin.

```tsx
'use client'

import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * HeroTransition — Overlay creme que faz a transição do hero para os produtos.
 * 
 * Fica FORA do ScrollWrapper (não é pinnado) para garantir que persiste
 * após o GSAP liberar o pin. Usa seu próprio ScrollTrigger vinculado
 * ao mesmo wrapper via data-attribute.
 */
export default function HeroTransition() {
    const overlayRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!overlayRef.current) return

        const wrapper = document.querySelector('[data-hero-wrapper]')
        if (!wrapper) return

        const ctx = gsap.context(() => {
            // O overlay creme aparece de 78% a 90% do scroll do hero
            // e PERMANECE visível (opacity: 1) até o conteúdo abaixo cobrir naturalmente
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    ease: 'power3.in',
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1.2,
                        // Mapear: o overlay começa a aparecer em 78% e está completo em 92%
                        // Como o scrub mapeia 0-1, usamos onUpdate para controlar manualmente
                    }
                }
            )

            // Abordagem mais precisa: usar onUpdate para controle manual
            ScrollTrigger.create({
                trigger: wrapper,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress
                    if (progress < 0.78) {
                        gsap.set(overlayRef.current, { opacity: 0 })
                    } else if (progress >= 0.78 && progress <= 0.92) {
                        // Mapear 0.78-0.92 para 0-1
                        const localProgress = (progress - 0.78) / (0.92 - 0.78)
                        gsap.set(overlayRef.current, { opacity: localProgress })
                    } else {
                        gsap.set(overlayRef.current, { opacity: 1 })
                    }
                }
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-[#FAF7F2] opacity-0 pointer-events-none z-[35]"
            style={{ willChange: 'opacity' }}
        />
    )
}
```

> **NOTA IMPORTANTE sobre z-index:** O overlay usa `z-[35]` — acima do conteúdo do hero (`z-20` a `z-30`) mas abaixo da navbar (`z-50`). Ajustar se necessário após teste visual.

> **NOTA sobre a abordagem dual:** O código acima tem duas abordagens (gsap.fromTo e ScrollTrigger.create com onUpdate). **Usar apenas uma delas.** Recomendo a abordagem com `onUpdate` porque dá controle preciso sobre os thresholds de 78% e 92%. Deletar o `gsap.fromTo` que está acima.

---

### 2C. Remover a transição creme do DiveOverlay (manter só o glow)

**Arquivo:** `src/app/(public)/_components/hero/DiveOverlay.tsx`

Remover:
- A animação do `transitionRef` (linhas 42-50)
- O elemento HTML do `transitionRef` (linhas 73-77)
- A declaração do `useRef` do `transitionRef` (linha 11)

O componente fica focado **apenas no glow dourado**:

```tsx
'use client'

import React, { useContext, useLayoutEffect, useRef } from 'react'
import { HeroContext } from './ScrollWrapper'
import gsap from 'gsap'

export default function DiveOverlay() {
    const { timeline } = useContext(HeroContext)
    const containerRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!timeline || !containerRef.current) return

        const ctx = gsap.context(() => {
            // 1. Golden Glow (Aparece suavemente)
            // Scroll 58% -> 70%
            timeline.fromTo(glowRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 12,
                    ease: 'power2.inOut'
                },
                58
            )

            // 2. Intensificação do Glow (Brilho explode)
            // Scroll 68% -> 78%
            timeline.to(glowRef.current, {
                scale: 1.5,
                duration: 10,
                ease: 'power1.in'
            }, 68)

            // Glow some no final
            timeline.to(glowRef.current, { opacity: 0, duration: 2 }, 88)

        }, containerRef)

        return () => ctx.revert()
    }, [timeline])

    return (
        <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none">
            {/* Golden Glow */}
            <div
                ref={glowRef}
                className="absolute inset-0 opacity-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(250,204,66,0.6) 0%, rgba(245,183,49,0.3) 40%, transparent 70%)',
                    mixBlendMode: 'screen'
                }}
            />
        </div>
    )
}
```

---

### 2D. Integrar HeroTransition no ImmersiveHero

**Arquivo:** `src/app/(public)/_components/hero/ImmersiveHero.tsx`

```tsx
'use client'

import React from 'react'
import ScrollWrapper from './ScrollWrapper'
import HeroCopy from './HeroCopy'
import FloatingPaes from './FloatingPaes'
import PaoDeQueijo from './PaoDeQueijo'
import DiveOverlay from './DiveOverlay'
import HeroTransition from './HeroTransition'

export default function ImmersiveHero() {
    return (
        <>
            <ScrollWrapper>
                {/* Background */}
                <div className="absolute inset-0 bg-[#3D2B22]" />

                <HeroCopy />
                <FloatingPaes />
                <PaoDeQueijo />
                <DiveOverlay />
            </ScrollWrapper>

            {/* Overlay creme de transição — FORA do ScrollWrapper
                para sobreviver ao unpin do GSAP */}
            <HeroTransition />
        </>
    )
}
```

---

### 2E. Antecipar transição de cor do HomeWrapper

**Arquivo:** `src/app/(public)/_components/HomeWrapper.tsx`

O HomeWrapper inicia com `bg-[#3D2B22]` e só muda pra creme quando `#destaques` entra na viewport. Precisamos antecipar isso.

**Mudança nas linhas 26-32 (dentro do `sections.forEach`):**

```tsx
// ANTES:
ScrollTrigger.create({
    trigger: selector,
    start: 'top 60%',
    end: 'top 20%',
    scrub: true,
    animation: gsap.to(main, { backgroundColor: color, ease: 'none' })
})

// DEPOIS (apenas para #destaques — a primeira seção):
const startValue = selector === '#destaques' ? 'top 95%' : 'top 60%'
const endValue = selector === '#destaques' ? 'top 60%' : 'top 20%'

ScrollTrigger.create({
    trigger: selector,
    start: startValue,
    end: endValue,
    scrub: true,
    animation: gsap.to(main, { backgroundColor: color, ease: 'none' })
})
```

> **Lógica:** Quando a seção `#destaques` entra com seu topo a 95% da viewport (ou seja, logo que aparece na borda inferior), o fundo do `<main>` já começa a transicionar pra `#FAF7F2`. Isso garante que o fundo claro está pronto antes da faixa marrom ter chance de aparecer.

---

### 2F. (Opcional) Remover `bg-[#3D2B22]` do wrapper de 600vh

**Arquivo:** `src/app/(public)/_components/hero/ScrollWrapper.tsx`

Se após os passos 2A-2E a faixa marrom ainda persistir, remover o background do wrapper:

```tsx
// ANTES (linha 60):
<div ref={wrapperRef} data-hero-wrapper className="relative w-full h-[600vh] bg-[#3D2B22]">

// DEPOIS:
<div ref={wrapperRef} data-hero-wrapper className="relative w-full h-[600vh]">
```

> ⚠️ **Testar primeiro sem remover.** O background marrom serve como fallback durante a animação. Se removê-lo causar flash de conteúdo branco durante o scroll, reverter.

---

**Validação Batch 2:**
- [ ] Pin funciona sem `fixed` CSS — scroll suave ida e volta
- [ ] Sem flash/salto no primeiro load da página
- [ ] Overlay creme (HeroTransition) aparece suavemente na região 78-92%
- [ ] Overlay creme PERSISTE após o unpin (sem faixa marrom)
- [ ] Glow dourado ainda funciona normalmente (DiveOverlay)
- [ ] Transição hero → produtos é seamless (sem gap de cor)
- [ ] `npm run build` passa sem erros
- [ ] Console sem warnings do ScrollTrigger

**Commit:** `fix: resolve pin conflict, move transition overlay outside ScrollWrapper, fix hero-to-products transition`

---

## BATCH 3 — Navbar (Independente)

### 3A. Navbar transparente durante o hero

**Arquivo:** `src/components/catalog/Navbar.tsx`

Substituir a lógica simples de `window.scrollY > 50` por detecção baseada no fim do hero:

```tsx
// ANTES (linhas 37-41):
useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
}, [])

// DEPOIS:
useEffect(() => {
    const handleScroll = () => {
        const heroWrapper = document.querySelector('[data-hero-wrapper]')
        if (heroWrapper) {
            // Só ativar fundo sólido quando o scroll ultrapassar 90% do hero
            const heroBottom = heroWrapper.scrollHeight * 0.9
            setIsScrolled(window.scrollY > heroBottom)
        } else {
            // Fallback para páginas sem hero
            setIsScrolled(window.scrollY > 50)
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

> **Por que 90%?** Aos 90% do scroll do hero, o overlay creme já está quase opaco (92% = opacity 1). A navbar clara aparece sobre fundo creme = harmonia visual. Antes disso, navbar transparente sobre fundo escuro = elegante.

> **Nota sobre cor do texto:** Com a navbar transparente sobre o hero escuro, o texto "Mont" e os ícones estão em `text-mont-espresso` (marrom escuro). Pode ter baixo contraste. Verificar se precisa de um `text-white` condicional quando `!isScrolled`.

**Validação Batch 3:**
- [ ] Navbar transparente durante todo o hero scroll
- [ ] Navbar sólida (creme) aparece só quando a seção de produtos é visível
- [ ] Texto da navbar legível tanto no hero escuro quanto nos produtos claros
- [ ] Em páginas sem hero (ex: `/cart`), a navbar funciona com fallback de 50px

**Commit:** `fix: navbar stays transparent during hero animation, solid only after products section`

---

## BATCH 4 — Scale Tuning (Requer Testes Visuais)

### 4A. Ajustar zoom de 1.5x para 1.1x

**Arquivo:** `src/app/(public)/_components/hero/PaoDeQueijo.tsx`

```tsx
// ANTES (linhas 18-19):
const targetH = window.innerHeight * 1.5
const targetW = window.innerWidth * 1.5

// DEPOIS:
const targetH = window.innerHeight * 1.1
const targetW = window.innerWidth * 1.1
```

**⚠️ PARAR E TESTAR EM MÚLTIPLAS VIEWPORTS:**
- 375×812 (iPhone SE / mobile)
- 768×1024 (iPad / tablet)
- 1440×900 (Desktop)
- 1920×1080 (Desktop full HD)

**O que observar:**
- O pão cobre a viewport toda antes do split?
- Ao separar as metades (xPercent ±40), aparece gap/fundo marrom entre elas?
- Se aparecer gap com 1.1x, testar com 1.2x antes de voltar pra 1.5x

---

### 4B. Reduzir scaleX do queijo de 4.0 para valor dinâmico

**Arquivo:** `src/app/(public)/_components/hero/PaoDeQueijo.tsx`

```tsx
// ANTES (linhas 97-103):
timeline.to(cheeseRef.current, {
    scaleX: 4.0,
    scaleY: 0.6,
    duration: 12,
    ease: 'power2.inOut'
}, 39)

// DEPOIS:
timeline.to(cheeseRef.current, {
    scaleX: () => {
        // Calcular scale necessário para preencher o gap entre as metades
        // As metades abrem xPercent: ±40, com left/right: -30% no cheese
        // Em telas menores, 4.0 é excessivo (20x efetivo)
        const vw = window.innerWidth
        if (vw <= 480) return 2.0      // Mobile: scale conservador
        if (vw <= 768) return 2.5      // Tablet
        return 3.0                      // Desktop (reduzido de 4.0)
    },
    scaleY: 0.6,
    duration: 12,
    ease: 'power2.inOut'
}, 39)
```

**Adicionar `invalidateOnRefresh` no PaoDeQueijo** para recalcular scales ao redimensionar:

Na timeline de zoom (linha 39-48), adicionar ao `sceneRef` zoom:

```tsx
// O invalidateOnRefresh já está no ScrollTrigger master (ScrollWrapper).
// Para os scales dinâmicos (getFullscreenScale e scaleX do queijo),
// precisamos garantir que as funções são re-avaliadas.
// O GSAP re-executa funções com invalidateOnRefresh: true no trigger pai.
// Verificar se isso funciona; se não, adicionar um listener de resize manual.
```

---

### 4C. Adicionar mask lateral ao queijo (bônus de polish)

**Arquivo:** `src/app/(public)/_components/hero/PaoDeQueijo.tsx`

Atualmente o queijo só tem feathering vertical (top/bottom). Adicionar lateral para esconder overflow:

```tsx
// ANTES (linhas 162-163):
WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'

// DEPOIS (compor gradientes vertical + horizontal):
WebkitMaskImage: `
    linear-gradient(to bottom, transparent, black 15%, black 85%, transparent),
    linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)
`.trim().replace(/\n\s*/g, ' '),
WebkitMaskComposite: 'intersect',
maskImage: `
    linear-gradient(to bottom, transparent, black 15%, black 85%, transparent),
    linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)
`.trim().replace(/\n\s*/g, ' '),
maskComposite: 'intersect'
```

> **Nota:** `mask-composite: intersect` faz a interseção dos dois gradientes (vertical e horizontal), criando feathering nos 4 lados. Verificar suporte no Safari com `-webkit-mask-composite: source-in`.

---

**Validação Batch 4:**
- [ ] Zoom 1.1x cobre a viewport sem overshooting excessivo
- [ ] Split não revela gaps entre as metades
- [ ] Queijo estica proporcionalmente em mobile, tablet e desktop
- [ ] Sem overflow visível do queijo fora do container
- [ ] Scroll reverso volta ao estado original sem glitches
- [ ] Performance: sem jank durante o zoom (verificar no DevTools → Performance tab)

**Commit:** `perf: optimize zoom scale to 1.1x, dynamic cheese scaleX, add lateral mask feathering`

---

## Checklist Final (Após Todos os Batches)

### Testes Obrigatórios
- [ ] Scroll completo ida e volta — todas as fases da animação
- [ ] Chrome DevTools → modo responsivo: 375px, 768px, 1440px
- [ ] Chrome DevTools → Performance tab → gravar scroll completo → verificar que FPS não cai abaixo de 30
- [ ] Simulador Safari (se disponível)
- [ ] `npm run build` sem erros
- [ ] Console limpo (sem warnings do GSAP ou ScrollTrigger)
- [ ] Deploy no Vercel → verificar site ao vivo

### Itens do PROMPT_IMPLEMENTACAO a Marcar como Concluídos
- [x] Configurar GSAP ScrollTrigger e testar pinning na Home
- [x] Limpar código e remover arquivos antigos
- [x] Verificar performance (fps) no Chrome
- [ ] Validar experiência Mobile (parcial — precisa teste em device real)

### Arquivos Tocados (Total)

| Arquivo | Ação | Batch |
|---------|------|-------|
| `ImmersiveHero.tsx` | Editado (remove debug, adiciona HeroTransition) | 1, 2 |
| `PaoDeQueijo.tsx` | Editado (visibility, zoom 1.1x, scaleX dinâmico, mask) | 1, 4 |
| `ScrollWrapper.tsx` | Editado (remove fixed, data-attr, invalidateOnRefresh) | 2 |
| `DiveOverlay.tsx` | Editado (remove transição creme, mantém glow) | 2 |
| `HeroTransition.tsx` | **NOVO** (overlay creme externo) | 2 |
| `HomeWrapper.tsx` | Editado (antecipa transição de cor) | 2 |
| `Navbar.tsx` | Editado (threshold baseado no hero) | 3 |

---

## Paleta de Cores (Referência)

```
--mont-brown-deep:    #3D2B22   (fundo hero, texto principal)
--mont-cream:         #FAF7F2   (fundo produtos, overlay transição)
--mont-orange:        #E8601C   (CTAs)
--mont-gold:          #F5B731   (badges, glow)
--mont-gold-light:    #FACC42   (glow overlay)
```
