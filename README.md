# Turistuble v13

Sitio estático HTML5 + CSS3 + JavaScript + JSON.

Cambios v13:
- Plan Destacado activo por $9.990 mensual.
- Se eliminó la palabra MVP de las páginas visibles.
- Header y footer homologados en todas las páginas.
- Footer con logo, links principales y botón Publicar negocio.
- Se mantiene la estructura visual, colores, tipografía, carrusel, buscador simplificado y JSON como fuente de datos.

## Ejecutar local

```bash
npm install
npm start
```

Abrir: http://localhost:3000


## Actualización v15
- Selector de comuna actualizado con las 21 comunas de la Región de Ñuble.
- En el formulario, las comunas se agrupan por provincia: Diguillín, Punilla e Itata.
- En el buscador principal, el selector de comuna muestra todas las comunas, aunque todavía no existan registros cargados en el JSON.


## Contacto configurado

- WhatsApp: +56 9 7716 7740
- Email: turistuble@gmail.com


## SEO agregado en v17 WhatsApp

- Metadatos SEO por página: title, description, keywords, robots, canonical, Open Graph y Twitter Cards.
- Metas geográficas para Región de Ñuble, Chile.
- JSON-LD base para WebSite, SearchAction y Organization.
- `robots.txt` y `sitemap.xml` generados.
- Imagen social `assets/img/og-turistuble.svg`.
- En `negocio.html`, el JavaScript actualiza título, descripción, canonical, OG/Twitter y JSON-LD según el `slug` cargado desde `negocios.json`.

Antes de publicar, si usas otro dominio, reemplaza `https://turistuble.cl` en los HTML, `robots.txt`, `sitemap.xml` y `assets/js/negocio.js`.
