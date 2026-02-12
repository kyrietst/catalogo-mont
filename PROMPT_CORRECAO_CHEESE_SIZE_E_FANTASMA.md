# PROMPT DE CORREÇÃO — Cheese Image Pequeno + Animação Amarela Fantasma

## Checklist de Correção
- [x] Mover `cheese.png` para dentro do `PaoDeQueijo.tsx` (Opção A)
- [x] Adicionar animação GSAP do cheese no `PaoDeQueijo.tsx`
- [x] Remover/deletar `CheeseStrings.tsx`
- [x] Limpar import no `ImmersiveHero.tsx`
- [x] Testar scroll completo — sem elementos amarelos CSS residuais
- [x] Validar scale do queijo acompanhando o scale do pão

## Bug 1: Imagem do cheese.png muito pequena

### O que está acontecendo
A imagem do queijo (`cheese.png`) aparece entre as metades do pão, mas está **minúscula** — quase imperceptível. Ela deveria cobrir toda a área entre as duas metades do pão, esticando de uma ponta à outra.

### Causa
O container do cheese está com dimensões fixas pequenas (`width: 40vmin, height: 20vmin` ou similar) que NÃO acompanham o scale massivo que o pão de queijo recebe durante o zoom.

Lembra: no scroll 15%→40%, o `PaoDeQueijo` escala de 1x até `getFullscreenScale()` (que pode ser 3x, 5x ou mais dependendo da viewport). O cheese precisa estar **dentro do mesmo sistema de coordenadas** do pão, ou ter dimensões que acompanhem esse scale.

### Solução

A imagem do cheese deve ser posicionada **DENTRO do `pao-scene` wrapper** (o `sceneRef` no `PaoDeQueijo.tsx`), não fora dele. Assim, quando o pão escala, o queijo escala junto automaticamente.

**Opção A (recomendada): Mover o cheese para dentro do PaoDeQueijo**

No `PaoDeQueijo.tsx`, adicionar a imagem do cheese como um elemento filho do `sceneRef`:

```tsx
<div ref={sceneRef} className="relative w-[40vmin] h-[40vmin] md:w-[30vmin] md:h-[30vmin]">
    
    {/* Left Half */}
    <div ref={crustLeftRef} className="absolute inset-0 w-full h-full">
        <img src="/hero-cheese/pao_left.png" ... />
    </div>

    {/* Right Half */}
    <div ref={crustRightRef} className="absolute inset-0 w-full h-full">
        <img src="/hero-cheese/pao_right.png" ... />
    </div>

    {/* Cheese — DENTRO do scene, herda o scale do pai */}
    <div
        ref={cheeseRef}
        className="absolute inset-0 flex items-center justify-center opacity-0 z-[5]"
    >
        <img
            src="/hero-cheese/cheese.png"
            alt="Queijo derretido"
            className="w-full h-auto object-contain"
            // w-full faz o queijo ter a mesma largura do pão
            // Ajustar com max-height se necessário
        />
    </div>
</div>
```

Isso significa que o `CheeseStrings.tsx` como componente separado pode ser **simplificado** — ele só precisa controlar a animação (opacity, scaleX) do cheese que agora vive dentro do `PaoDeQueijo`.

**Opção B: Se preferir manter separado**, o container do cheese precisa ter as MESMAS dimensões e scale do pão. Mas isso é mais complicado e propenso a bugs de sincronização. A Opção A é muito mais limpa.

### Animação do cheese (ajustar no componente que controlar)

```tsx
// O cheese começa invisível e com scaleX comprimido
// Aparece durante o split e estica

timeline.fromTo(cheeseRef.current,
    { scaleX: 0.3, opacity: 0 },
    {
        scaleX: 1.2,   // Estica um pouco além do container
        opacity: 1,
        duration: 14,
        ease: 'power2.out'
    },
    44  // Começa junto com o split
)

// Continua esticando
timeline.to(cheeseRef.current, {
    scaleX: 1.8,
    duration: 8,
    ease: 'power1.out'
}, 58)
```

---

## Bug 2: Animação amarela CSS ainda aparece (FANTASMA)

### O que está acontecendo
Depois que o cheese.png aparece (correto), ao continuar o scroll, as **barras amarelas CSS antigas** (os `cheese-strand` divs com gradiente amarelo `#FACC42`) reaparecem. Elas deveriam ter sido REMOVIDAS completamente.

### Causa
O `CheeseStrings.tsx` foi **parcialmente** reescrito. A imagem do `cheese.png` foi adicionada, MAS os divs antigos dos strands e drops NÃO foram removidos do JSX. Eles ainda estão no DOM e suas animações GSAP ainda rodam.

### Solução

Limpar COMPLETAMENTE o `CheeseStrings.tsx`:

1. **Remover** todos os `strands` (as 7 divs `cheese-strand` com gradiente CSS)
2. **Remover** todos os `drops` (as 4 divs `cheese-drop`)  
3. **Remover** as animações GSAP que referenciam `.cheese-strand` e `.cheese-drop`
4. **Remover** os arrays de configuração (`const strands = [...]` e `const drops = [...]`)

Se a imagem do cheese for movida para dentro do `PaoDeQueijo.tsx` (Opção A acima), o `CheeseStrings.tsx` pode ser **completamente esvaziado** ou **deletado**, e a referência removida do `ImmersiveHero.tsx`:

```tsx
// ImmersiveHero.tsx — remover a importação e uso
// ANTES:
import CheeseStrings from './CheeseStrings'
// ...
<CheeseStrings />

// DEPOIS:
// Remover ambos. O cheese agora vive dentro do PaoDeQueijo.
```

---

## Resumo

| Arquivo | Ação |
|---------|------|
| `PaoDeQueijo.tsx` | Adicionar `<img src="/hero-cheese/cheese.png">` DENTRO do `sceneRef` wrapper. Adicionar animação GSAP para o cheese (opacity + scaleX). |
| `CheeseStrings.tsx` | **Deletar o arquivo** ou esvaziar completamente. Remover TODOS os strands e drops CSS. |
| `ImmersiveHero.tsx` | Remover `import CheeseStrings` e `<CheeseStrings />` do JSX. |

## Ordem
1. Mover cheese.png para dentro do `PaoDeQueijo.tsx`
2. Adicionar animação GSAP do cheese no `PaoDeQueijo.tsx`
3. Remover/deletar `CheeseStrings.tsx`
4. Limpar import no `ImmersiveHero.tsx`
5. Testar scroll completo — não pode existir NENHUM elemento amarelo CSS
