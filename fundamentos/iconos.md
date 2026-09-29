# Iconos

Un icono acompaña una acción o un estado; no debe reemplazar su nombre accesible. Usa un trazo consistente, proporciones similares y una caja mínima de interacción de 44 × 44 px en controles táctiles.

<div class="l-demo l-actions"><button class="l-btn l-secondary" type="button" aria-label="Buscar"><span aria-hidden="true">⌕</span> Buscar</button><button class="l-btn l-secondary" type="button" aria-label="Añadir"><span aria-hidden="true">＋</span> Añadir</button><button class="l-btn l-secondary" type="button" aria-label="Abrir ajustes"><span aria-hidden="true">⚙</span> Ajustes</button><span class="l-badge l-badge-success"><span aria-hidden="true">✓</span> Listo</span></div>

Los símbolos de arriba ilustran el patrón, **no constituyen una librería de iconos**: su aspecto puede variar entre sistemas. En producto usa SVGs de una familia controlada, con `currentColor` y `aria-hidden="true"` cuando haya texto visible. Si el icono es el único contenido del botón, agrega `aria-label`. No dependas solo de un icono para error o éxito.

```html
<button type="button" aria-label="Cerrar" class="icon-button">
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M6 6l12 12M18 6L6 18" stroke-width="2" stroke-linecap="round"/>
  </svg>
</button>
```
