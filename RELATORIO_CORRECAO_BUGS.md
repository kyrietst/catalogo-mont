# Relatório de Correção de Bugs de Animação

Este relatório acompanha o progresso da correção dos bugs críticos identificados na animação da seção Hero.

## Checklist de Correção

### Bug 1: Clip-path cortando o pão de queijo (PRIORIDADE MÁXIMA)
- [x] Análise da estrutura atual de `PaoDeQueijo.tsx`
- [x] Refatoração: Remover clip-paths prematuros do HTML
- [x] Implementação: Adicionar animação de clip-path via GSAP para sincronizar com o split
- [ ] Validação: Verificar se o pão está redondo no início (scroll 0%)
- [ ] Validação: Verificar se o split ocorre sem cortes abruptos

### Bug 2: Cheese Strings visual genérico
- [x] Análise de `CheeseStrings.tsx`
- [x] Implementação: Substituir divs CSS por imagem `cheese.png`
- [x] Implementação: Configurar animação de `scaleX` e opacidade via GSAP
- [ ] Validação: Verificar alinhamento e esticamento do queijo durante o split

### Validação Final
- [ ] Teste completo da sequência de scroll (0% -> 100%)
- [ ] Verificar responsividade e performance
