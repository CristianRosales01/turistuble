Arquitectura y archivos clave del proyecto Turistuble

Root
- `index.html` — Página principal / buscador.
- `negocio.html` — Plantilla de ficha individual; se rellena con datos según `slug`.
- `publicar.html` — Formulario para generar mensajes de publicación (WhatsApp).
- `README.md` — Documentación principal (actualizada).
- `robots.txt`, `sitemap.xml` — Archivos SEO.

`assets/`
- `assets/css/styles.css` — Estilos principales y variables CSS.
- `assets/js/app.js` — Lógica del buscador, carga de `negocios.json` y `hero-slides.json`, renderizado de cards y carrusel.
- `assets/js/negocio.js` — Lógica de la ficha: carga por `slug`, render del detalle y actualización dinámica de metas/JSON-LD.
- `assets/js/publicar.js` — Lógica del formulario de publicación y generación de mensaje para WhatsApp.
- `assets/data/negocios.json` — JSON con publicaciones (negocios y eventos). Fuente de contenido principal.
- `assets/data/hero-slides.json` — JSON con los slides promocionales del hero.
- `assets/img/` — Imágenes de placeholders y recursos gráficos.

Cómo se consumen los datos
- `app.js` hace `fetch('/assets/data/negocios.json')` y renderiza listados y destacados.
- `negocio.js` hace `fetch('/assets/data/negocios.json')` y busca por `slug` para renderizar la ficha y actualizar metadata.

Puntos importantes para mantener o desplegar
- Si el sitio se publica en otro dominio reemplazar `https://turistuble.cl` en los HTML, `robots.txt`, `sitemap.xml` y en `assets/js/negocio.js` (const `SITE_URL`).
- Para pruebas locales usar un servidor estático (ver `README.md`).
- Para actualizar contenido visible, editar `assets/data/negocios.json` o añadir nuevas imágenes en `assets/img/` y actualizar las rutas.

Ideas rápidas de mejora
- Añadir `package.json` con `start` que ejecute `http-server` o similar.
- Añadir script de validación JSON para `negocios.json`.
- Integrar un paso de build (esbuild/rollup) si se quiere modularizar JS.

Si quieres, genero automáticamente `package.json` con `start` y `dev` scripts.
