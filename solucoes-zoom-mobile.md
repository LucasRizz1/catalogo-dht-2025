# Soluções de Pinch Zoom Mobile - Pesquisa Stack Overflow e MDN

## Problemas Identificados com Nossa Implementação Atual

1. **Touch Events vs Pointer Events**: Nossa implementação atual usa touch events, mas a MDN recomenda pointer events para melhor compatibilidade
2. **Gestão de Estado**: Falta de cache adequado para eventos de múltiplos toques
3. **Cálculo de Distância**: Algoritmo de distância entre pontos pode estar incorreto
4. **Prevenção de Eventos Padrão**: `touch-action: none` pode ser necessário

## Soluções Encontradas na MDN

### 1. Usar Pointer Events (Recomendado)
```javascript
// Ao invés de touchstart/touchmove/touchend
el.onpointerdown = pointerdownHandler;
el.onpointermove = pointermoveHandler;
el.onpointerup = pointerupHandler;
```

### 2. Cache de Eventos Adequado
```javascript
// Cache global para eventos
const evCache = [];
let prevDiff = -1;

function pointerdownHandler(ev) {
    evCache.push(ev);
}

function pointermoveHandler(ev) {
    // Encontrar evento no cache e atualizar
    const index = evCache.findIndex(
        (cachedEv) => cachedEv.pointerId === ev.pointerId
    );
    evCache[index] = ev;
    
    // Se dois ponteiros estão ativos
    if (evCache.length === 2) {
        // Calcular distância entre os dois ponteiros
        const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
        
        if (prevDiff > 0) {
            if (curDiff > prevDiff) {
                // Zoom in (pinch out)
                console.log("Zoom in");
            }
            if (curDiff < prevDiff) {
                // Zoom out (pinch in)
                console.log("Zoom out");
            }
        }
        
        prevDiff = curDiff;
    }
}
```

### 3. CSS Essencial
```css
body {
    touch-action: none; /* Previne comportamento padrão do touch */
}
```

### 4. Limpeza de Cache
```javascript
function pointerupHandler(ev) {
    // Remover evento do cache
    const index = evCache.findIndex(
        (cachedEv) => cachedEv.pointerId === ev.pointerId
    );
    evCache.splice(index, 1);
    
    // Reset se menos de 2 ponteiros
    if (evCache.length < 2) {
        prevDiff = -1;
    }
}
```

## Bibliotecas Alternativas Encontradas

### PinchZoom.js
- URL: https://manuelstofer.github.io/pinchzoom/
- Features: Multi-touch gestures, double tap zoom, dragging
- Sem dependências
- Suporte AMD

### Hammer.js
- Biblioteca popular para gestos touch
- Suporte completo a pinch zoom
- Mais pesada mas mais robusta

## Implementação Recomendada

1. **Migrar para Pointer Events**: Melhor compatibilidade cross-browser
2. **Implementar Cache Adequado**: Gestão correta de múltiplos ponteiros
3. **Adicionar touch-action: none**: Prevenir comportamento padrão
4. **Usar Algoritmo de Distância Correto**: Math.abs(x1 - x2) para horizontal
5. **Gestão de Estado Robusta**: Limpeza adequada de cache

## Próximos Passos

1. Refatorar código atual usando pointer events
2. Implementar cache de eventos como na MDN
3. Adicionar CSS touch-action: none
4. Testar em dispositivos móveis reais
5. Fallback para touch events se necessário

