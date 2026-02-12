# PROMPT DE CORREÇÃO — 2 Bugs Críticos na Animação

## Bug 1: Clip-path cortando o pão de queijo (PRIORIDADE MÁXIMA)

### O que está acontecendo
O pão de queijo está sendo cortado por uma "caixa invisível" no lado direito, fazendo com que ele não apareça redondo/completo. Olhando o screenshot, a metade direita está com o corte reto visível — quando deveria se encaixar perfeitamente com a metade esquerda formando o pão completo.

### Causa raiz no código (`PaoDeQueijo.tsx`)

O problema está nos clip-paths e na estrutura de wrapping. Atualmente:

```tsx
{/* --- Left Half --- */}
<div className="absolute inset-0 w-full h-full clip-half-left">
    <div ref={crustLeftRef} className="absolute inset-0 w-full h-full">
        <img src="/hero-cheese/pao_left.png" className="w-full h-full object-contain object-left scale-[1.02]" />
    </div>
</div>

{/* --- Right Half --- */}
<div className="absolute inset-0 w-full h-full clip-half-right">
    <div ref={crustRightRef} className="absolute inset-0 w-full h-full">
        <img src="/hero-cheese/pao_right.png" className="w-full h-full object-contain object-right scale-[1.02]" />
    </div>
</div>
```

Com os clip-paths:
```css
.clip-half-left {
    clip-path: inset(0 50% 0 0);
}
.clip-half-right {
    clip-path: inset(0 0 0 50%);
}
```

**O problema é duplo:**

1. O `clip-path: inset()` está no **wrapper externo**, mas o `ref` para animação GSAP (que recebe o `xPercent`) está no **div interno**. Quando o GSAP move o `crustRightRef` com `xPercent: 40`, a imagem se move mas **o clip-path do wrapper pai continua fixo**, cortando a imagem que deveria ter saído do recorte.

2. O `clip-path` deveria estar no **mesmo elemento** que recebe a animação GSAP de translação, ou melhor ainda: os clip-paths só devem ser aplicados **durante a fase de split**, não antes. Antes do split, o pão deve aparecer inteiro (sem nenhum clip-path) porque as duas imagens juntas formam o pão completo.

### Solução

Reestruturar para que:

**Antes do split (scroll 0% → 42%):** As duas imagens se sobrepõem SEM clip-path, formando o pão completo. O `pao_left.png` e `pao_right.png` são as duas metades que quando sobrepostas criam o visual do pão inteiro.

**Durante o split (scroll 42%+):** Os clip-paths são aplicados dinamicamente E a translação acontece no mesmo elemento.

A forma mais limpa de resolver:

```tsx
// Estrutura corrigida:
<div ref={sceneRef} className="relative w-[40vmin] h-[40vmin] md:w-[30vmin] md:h-[30vmin]">
    
    {/* Left Half - ref recebe TANTO o clip-path QUANTO a translação */}
    <div
        ref={crustLeftRef}
        className="absolute inset-0 w-full h-full"
        // SEM clip-path inicial — será adicionado via GSAP antes do split
    >
        <img
            src="/hero-cheese/pao_left.png"
            alt="Pão Esquerda"
            className="w-full h-full object-contain"
        />
    </div>

    {/* Right Half */}
    <div
        ref={crustRightRef}
        className="absolute inset-0 w-full h-full"
        // SEM clip-path inicial
    >
        <img
            src="/hero-cheese/pao_right.png"
            alt="Pão Direita"
            className="w-full h-full object-contain"
        />
    </div>
</div>
```

E na timeline GSAP, ANTES do split começar, aplicar os clip-paths:

```tsx
// No scroll ~40% (logo antes do split), aplica os clip-paths
timeline.set(crustLeftRef.current, {
    clipPath: 'inset(0 50% 0 0)'
}, 40)

timeline.set(crustRightRef.current, {
    clipPath: 'inset(0 0 0 50%)'
}, 40)

// Agora o split funciona porque clip-path e xPercent estão no MESMO elemento
timeline.to(crustLeftRef.current, {
    xPercent: -40,
    duration: 20,
    ease: 'power2.inOut'
}, 40)

timeline.to(crustRightRef.current, {
    xPercent: 40,
    duration: 20,
    ease: 'power2.inOut'
}, 40)
```

**Alternativa mais suave:** Em vez de aplicar clip-path abruptamente com `set`, animar o clip-path junto com a translação. O GSAP consegue animar clip-path:

```tsx
// Left half: clip-path vai de "sem corte" para "corte na metade direita"
// e simultaneamente translada para esquerda
timeline.fromTo(crustLeftRef.current,
    { clipPath: 'inset(0 0% 0 0)', xPercent: 0 },
    { clipPath: 'inset(0 50% 0 0)', xPercent: -40, duration: 20, ease: 'power2.inOut' },
    40
)

// Right half: espelhado
timeline.fromTo(crustRightRef.current,
    { clipPath: 'inset(0 0 0 0%)', xPercent: 0 },
    { clipPath: 'inset(0 0 0 50%)', xPercent: 40, duration: 20, ease: 'power2.inOut' },
    40
)
```

Isso faz o "corte" aparecer gradualmente conforme as metades se separam — muito mais natural.

### Verificação
Depois de aplicar a correção, confirme que:
- [ ] No scroll 0% o pão aparece 100% redondo, sem nenhum corte reto visível
- [ ] As duas imagens se sobrepõem perfeitamente formando o pão inteiro
- [ ] Durante o split, o corte aparece naturalmente conforme as metades se afastam
- [ ] Não existe gap ou linha preta visível entre as metades antes do split

---

## Bug 2: Cheese Strings usando animação CSS genérica em vez da imagem real

### O que está acontecendo
O `CheeseStrings.tsx` cria fios de queijo com CSS puro (divs com gradiente amarelo `#FACC42`). O resultado visual ficou péssimo — parece barras amarelas genéricas, não queijo derretido.

Já existe uma imagem real do queijo derretido no projeto: `/public/hero-cheese/cheese.png`

### O que fazer

Substituir completamente a abordagem CSS por uma implementação usando a imagem `cheese.png`.

A imagem `cheese.png` é a "liga de queijo" — aquele fio de queijo derretido que aparece quando você abre um pão de queijo. Ela deve ser posicionada no centro entre as duas metades, e sua animação deve ser:

1. **Antes do split:** Invisível (opacity 0, ou scale 0)
2. **Durante o split (scroll 44%→58%):** Aparece no centro entre as metades e estica horizontalmente acompanhando a abertura. Use `scaleX` para simular o queijo esticando conforme as metades se afastam.
3. **Durante o dive (scroll 62%+):** Escala junto com tudo e faz fade out

### Implementação sugerida

```tsx
// CheeseStrings.tsx — Versão com imagem real

export default function CheeseStrings() {
    const { timeline } = useContext(HeroContext)
    const cheeseRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!timeline || !cheeseRef.current) return

        const ctx = gsap.context(() => {
            // Cheese aparece e estica durante o split
            timeline.fromTo(cheeseRef.current,
                { scaleX: 0.2, opacity: 0 },
                {
                    scaleX: 1,     // Estica horizontalmente
                    opacity: 1,
                    duration: 14,
                    ease: 'power2.out'
                },
                44
            )

            // Continua esticando um pouco mais
            timeline.to(cheeseRef.current, {
                scaleX: 1.5,
                duration: 8,
                ease: 'power1.out'
            }, 56)

            // Dive: explode e some
            timeline.to(cheeseRef.current, {
                scale: 3,
                opacity: 0,
                duration: 20,
                ease: 'power2.in'
            }, 62)

        }, cheeseRef)

        return () => ctx.revert()
    }, [timeline])

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div
                ref={cheeseRef}
                className="relative opacity-0 origin-center"
                style={{
                    // Ajustar width/height conforme o tamanho real do cheese.png
                    // A imagem deve cobrir o gap entre as metades
                    width: '40vmin',   // Ajustar conforme necessário
                    height: '20vmin',  // Ajustar conforme necessário
                }}
            >
                <img
                    src="/hero-cheese/cheese.png"
                    alt="Queijo derretido"
                    className="w-full h-full object-contain"
                    // object-contain mantém a proporção da imagem
                />
            </div>
        </div>
    )
}
```

### Notas sobre posicionamento
- A imagem do queijo precisa ficar **centralizada verticalmente** na mesma posição do pão
- O `scaleX` inicial de 0.2 simula o queijo "comprimido" e vai esticando conforme as metades se abrem
- Se a imagem do `cheese.png` tiver fundo transparente (PNG), vai se integrar perfeitamente ao fundo escuro (#3D2B22)
- Se precisar ajustar a posição vertical, use `translateY` no style ou mude o `items-center` do container

### Verificação
- [ ] A imagem cheese.png aparece no centro quando o pão abre
- [ ] O queijo estica horizontalmente de forma natural
- [ ] Não existem mais barras amarelas CSS (divs com gradiente)
- [ ] O visual se integra com as metades do pão

---

## Resumo das Alterações

| Arquivo | O que mudar |
|---------|-------------|
| `PaoDeQueijo.tsx` | Remover clip-paths do HTML. Remover wrappers extras. Aplicar clip-path via GSAP apenas durante o split, no mesmo elemento que recebe xPercent. |
| `CheeseStrings.tsx` | Reescrever completamente. Substituir divs CSS por `<img src="/hero-cheese/cheese.png">` com animação de scaleX. |

## Ordem de execução
1. **Primeiro** corrija o `PaoDeQueijo.tsx` (Bug 1) e valide que o pão aparece redondo
2. **Depois** corrija o `CheeseStrings.tsx` (Bug 2) e valide que o queijo aparece com a imagem real
3. Teste a sequência completa de scroll do início ao fim
