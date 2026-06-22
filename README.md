# Turistuble v13

Sitio estático HTML5 + CSS3 + JavaScript + JSON.

Cambios v13:
- Plan Destacado activo por $9.990 mensual.
- Se eliminó la palabra MVP de las páginas visibles.
- Header y footer homologados en todas las páginas.
- Footer con logo, links principales y botón Publicar negocio.
- Se mantiene la estructura visual, colores, tipografía, carrusel, buscador simplificado y JSON como fuente de datos.

# Turistuble

Proyecto: sitio estático para un buscador turístico de la Región de Ñuble (HTML5, CSS3, JavaScript y JSON).

Resumen rápido
- UI responsive con tres páginas principales: portada (`index.html`), ficha (`negocio.html`) y formulario de publicación (`publicar.html`).
- Datos de ejemplo y contenido dinámico cargados desde JSON en `assets/data/` (`negocios.json`, `hero-slides.json`).
- SEO: metadatos estáticos en cada HTML y generación dinámica de meta/JSON-LD en `assets/js/negocio.js`.

Estado del repo
- Sitio está listo como contenido estático. Incluye `package.json` con scripts de inicio (`start`, `dev`) para servir el contenido localmente.

Archivos añadidos por este análisis
- `FILES.md`: mapa de archivos y explicación de cada componente (ver más abajo).

Cómo ejecutar local (opciones)
- Usar un servidor estático simple (recomendado):

```bash
# Opción 1: con Python 3 (puerto 8000)
python3 -m http.server 8000

# Opción 2: con Node + http-server (si tienes npm)
npx http-server -p 3000

# Opción 3: Live Server extension en VS Code
# Instala Live Server y elige "Open with Live Server"
```

Usando los scripts del repositorio (requiere `node`/`npm`):

```bash
# Ejecutar con http-server (desde el repo)
npm run start

# Abrir en modo live (live-server)
npm run dev
```

Luego abre en el navegador:

- Python: http://localhost:8000
- http-server: http://localhost:3000

Notas de desarrollo
- Los datos mostrados en la web provienen de `assets/data/negocios.json` y `assets/data/hero-slides.json`.
- Reemplaza las rutas absolutas a `https://turistuble.cl` en los HTML y en `assets/js/negocio.js` si vas a desplegar en otro dominio.
- Si abres los archivos directamente como `file://` algunas llamadas `fetch()` fallarán; por eso se recomienda usar un servidor local.

Estructura y archivos clave
- Ver `FILES.md` para un desglose completo de archivos y responsabilidades.

Cambios históricos y contacto
- Información de versiones y contactos se conserva en el historial del repo.

Contacto
- WhatsApp: +56977167740
- Email: turistuble@gmail.com

Si quieres, puedo:
- Ejecutar pruebas básicas de carga de los JSON.
- Crear un `package.json` con un script `start` que use `http-server`.
- Añadir instrucciones Docker o GitHub Pages para despliegue.

Despliegue

Actualmente no hay configuraciones de despliegue incluidas en el repositorio. Si quieres, puedo añadir opciones (Docker, GitHub Actions, GitHub Pages) cuando lo solicites.
