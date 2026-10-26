# Iconos

Un icono acompaña una acción o un estado; no debe reemplazar su nombre accesible. Usa un trazo consistente, proporciones similares y una caja mínima de interacción de 44 × 44 px en controles táctiles.

## Librería por defecto: Font Awesome Free

Todos los templates usan **Font Awesome Free** como familia de iconos por defecto. El CSS y las fuentes (`solid`, `regular` y `brands`) se distribuyen localmente en `/vendor/fontawesome/` — sin CDN ni kit de pago — y se cargan en todas las páginas de las guías y en los HTML independientes. Licencias: código MIT, fuentes SIL OFL 1.1 e iconos CC BY 4.0 (detalle en `/vendor/fontawesome/LICENSE.txt`).

<div class="l-demo l-actions"><button class="l-btn l-secondary" type="button" aria-label="Buscar"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Buscar</button><button class="l-btn l-secondary" type="button" aria-label="Añadir"><i class="fa-solid fa-plus" aria-hidden="true"></i> Añadir</button><button class="l-btn l-secondary" type="button" aria-label="Abrir ajustes"><i class="fa-solid fa-gear" aria-hidden="true"></i> Ajustes</button><span class="l-badge l-badge-success"><i class="fa-solid fa-check" aria-hidden="true"></i> Listo</span></div>

Usa las clases `fa-solid`, `fa-regular` o `fa-brands` con el nombre del icono. El icono hereda color (`currentColor`) y tamaño de su contenedor; ajústalo con `font-size` o las clases de escala (`fa-lg`, `fa-xl`, `fa-2x`…). Cuando el icono acompaña texto visible, márcalo `aria-hidden="true"`. Si el icono es el único contenido del botón, agrega `aria-label`. No dependas solo de un icono para comunicar error o éxito.

```html
<button type="button" aria-label="Cerrar" class="icon-button">
  <i class="fa-solid fa-xmark" aria-hidden="true"></i>
</button>
```

Buscador de iconos disponibles en la licencia Free: <https://fontawesome.com/search?o=r&m=free>
