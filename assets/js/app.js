let publicaciones = [];
let publicacionesFiltradas = [];
let heroSlides = [];
let heroSlideIndex = 0;
let heroSlideTimer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const normalizar = (valor = '') => valor
  .toString()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');


async function cargarHeroSlides() {
  try {
    const response = await fetch('/assets/data/hero-slides.json');
    heroSlides = await response.json();
    if (!heroSlides.length) return;
    renderizarHeroSlide(0);
    activarHeroCarousel();
  } catch (error) {
    console.warn('No se pudo cargar hero-slides.json. Se mantiene el slide por defecto.', error);
  }
}

function renderizarHeroSlide(index) {
  if (!heroSlides.length) return;
  heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[heroSlideIndex];

  const heroSlide = $('#heroSlide');
  const category = $('#heroSlideCategory');
  const title = $('#heroSlideTitle');
  const subtitle = $('#heroSlideSubtitle');
  const cta = $('#heroSlideCta');

  if (heroSlide) heroSlide.style.backgroundImage = `url('${slide.imagen}')`;
  if (category) category.textContent = slide.categoria || 'Publicidad destacada';
  if (title) title.textContent = slide.titulo || 'Descubre Ñuble';
  if (subtitle) subtitle.textContent = slide.subtitulo || 'Encuentra turismo local en un solo lugar.';
  if (cta) {
    cta.textContent = slide.ctaTexto || 'Explorar';
    cta.onclick = () => aplicarFiltroHero(slide);
  }

  $$('.hero-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === heroSlideIndex));
}

function activarHeroCarousel() {
  const dots = $('#heroDots');
  if (dots) {
    dots.innerHTML = heroSlides.map((_, index) => `<button class="hero-dot ${index === 0 ? 'active' : ''}" type="button" aria-label="Ver promoción ${index + 1}" data-hero-dot="${index}"></button>`).join('');
    $$('.hero-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        renderizarHeroSlide(Number(dot.dataset.heroDot));
        reiniciarHeroAutoplay();
      });
    });
  }

  $('#heroPrev')?.addEventListener('click', () => {
    renderizarHeroSlide(heroSlideIndex - 1);
    reiniciarHeroAutoplay();
  });

  $('#heroNext')?.addEventListener('click', () => {
    renderizarHeroSlide(heroSlideIndex + 1);
    reiniciarHeroAutoplay();
  });

  reiniciarHeroAutoplay();
}

function reiniciarHeroAutoplay() {
  if (heroSlideTimer) clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => renderizarHeroSlide(heroSlideIndex + 1), 5200);
}

function aplicarFiltroHero(slide) {
  const categoriaSelect = $('#categoria');
  const busqueda = $('#busqueda');

  if (slide.ctaFiltro && categoriaSelect) {
    categoriaSelect.value = slide.ctaFiltro;
    if (busqueda) busqueda.value = '';
    activarPill(slide.ctaFiltro);
  }

  if (slide.ctaTextoBusqueda && busqueda) {
    busqueda.value = slide.ctaTextoBusqueda;
    if (categoriaSelect) categoriaSelect.value = '';
    activarPill(slide.ctaTextoBusqueda);
  }

  filtrarPublicaciones();
  document.querySelector('#explorar')?.scrollIntoView({ behavior: 'smooth' });
}

async function cargarPublicaciones() {
  try {
    const response = await fetch('/assets/data/negocios.json');
    publicaciones = await response.json();
    publicacionesFiltradas = publicaciones;
    poblarFiltros();
    renderizarDestacados(publicaciones);
    renderizarPublicaciones(publicaciones);
    activarEventos();
  } catch (error) {
    console.error(error);
    $('#resultados').innerHTML = '<div class="empty-state">No se pudo cargar el archivo JSON. Si abres el sitio directo como archivo, usa un servidor local.</div>';
  }
}

function valoresUnicos(campo) {
  return [...new Set(publicaciones.map(item => item[campo]).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function poblarSelect(selector, valores) {
  const select = $(selector);
  if (!select) return;

  const primeraOpcion = select.querySelector('option')?.outerHTML || '<option value="">Todos</option>';
  select.innerHTML = primeraOpcion;

  valores.forEach(valor => {
    const option = document.createElement('option');
    option.value = valor;
    option.textContent = valor;
    select.appendChild(option);
  });
}

function poblarFiltros() {
  poblarSelect('#categoria', valoresUnicos('categoria'));
  poblarSelect('#comuna', valoresUnicos('comuna'));
}

function activarEventos() {
  const menuToggle = $('#menuToggle');
  const navActions = $('#navActions');

  if (menuToggle && navActions) {
    menuToggle.addEventListener('click', () => navActions.classList.toggle('open'));
  }

  ['#busqueda', '#categoria', '#comuna'].forEach(selector => {
    const element = $(selector);
    if (!element) return;
    element.addEventListener(selector === '#busqueda' ? 'input' : 'change', filtrarPublicaciones);
  });

  const buscarBtn = $('#buscarBtn');
  if (buscarBtn) {
    buscarBtn.addEventListener('click', () => {
      filtrarPublicaciones();
      document.querySelector('#explorar')?.scrollIntoView({ behavior: 'smooth' });
    });
  }


  const limpiar = $('#limpiarFiltros');
  if (limpiar) {
    limpiar.addEventListener('click', () => {
      ['#busqueda', '#categoria', '#comuna'].forEach(selector => {
        const element = $(selector);
        if (element) element.value = '';
      });
      activarPill('');
      renderizarPublicaciones(publicaciones);
    });
  }

  $$('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const categoria = pill.dataset.quickFilter;
      const texto = pill.dataset.quickText;

      if (categoria !== undefined) {
        const categoriaSelect = $('#categoria');
        const busqueda = $('#busqueda');
        if (categoriaSelect) categoriaSelect.value = categoria;
        if (busqueda) busqueda.value = '';
        activarPill(categoria);
      }

      if (texto !== undefined) {
        const busqueda = $('#busqueda');
        const categoriaSelect = $('#categoria');
        if (busqueda) busqueda.value = texto;
        if (categoriaSelect) categoriaSelect.value = '';
        activarPill(texto);
      }

      filtrarPublicaciones();
      document.querySelector('#explorar')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function activarPill(valor) {
  $$('.category-pill').forEach(pill => {
    const pillValue = pill.dataset.quickFilter ?? pill.dataset.quickText ?? '';
    pill.classList.toggle('active', pillValue === valor);
  });
}

function filtrarPublicaciones() {
  const texto = normalizar($('#busqueda')?.value || '');
  const categoria = $('#categoria')?.value || '';
  const comuna = $('#comuna')?.value || '';

  publicacionesFiltradas = publicaciones.filter(item => {
    const textoBuscable = normalizar(`
      ${item.nombre}
      ${item.tipo}
      ${item.categoria}
      ${item.subcategoria}
      ${item.region}
      ${item.provincia}
      ${item.comuna}
      ${item.sector}
      ${item.direccion}
      ${item.referencia}
      ${item.descripcion}
      ${item.descripcionLarga}
      ${item.precio}
      ${(item.servicios || []).join(' ')}
      ${(item.tags || []).join(' ')}
    `);

    const coincideTexto = !texto || textoBuscable.includes(texto);
    const coincideCategoria = !categoria || item.categoria === categoria;
    const coincideComuna = !comuna || item.comuna === comuna;
    return coincideTexto && coincideCategoria && coincideComuna;
  });

  renderizarPublicaciones(publicacionesFiltradas);
}


function renderizarDestacados(items) {
  const contenedor = $('#destacadosGrid');
  if (!contenedor) return;

  const destacados = items.filter(item => item.destacado === true).slice(0, 3);

  if (!destacados.length) {
    contenedor.innerHTML = '<div class="empty-state">Aún no hay destacados publicados.</div>';
    return;
  }

  contenedor.innerHTML = destacados.map(crearCard).join('');
}

function renderizarPublicaciones(items) {
  const contenedor = $('#resultados');
  const contador = $('#contadorResultados');
  if (contador) {
    contador.textContent = `${items.length} resultado${items.length === 1 ? '' : 's'} encontrado${items.length === 1 ? '' : 's'}`;
  }

  if (!items.length) {
    contenedor.innerHTML = '<div class="empty-state">No encontramos publicaciones con esos filtros. Prueba con otra comuna, categoría o palabra clave.</div>';
    return;
  }

  contenedor.innerHTML = items.map(crearCard).join('');
}

function crearCard(item) {
  const imagen = item.imagenes?.[0] || '/assets/img/placeholder-nature.svg';
  const servicios = (item.servicios || []).slice(0, 3).map(servicio => `<span>${servicio}</span>`).join('');
  const badges = `
    <div class="badge-row">
      ${item.destacado ? '<span class="badge">Destacado</span>' : ''}
      <span class="badge-soft">${item.tipo}</span>
    </div>
  `;

  return `
    <article class="card marketplace-card">
      <a class="card-media" href="/negocio.html?slug=${encodeURIComponent(item.slug)}" onclick="localStorage.setItem('turistuble_selected_slug', '${item.slug}')">
        <img src="/${imagen.replace(/^\//, '')}" alt="${item.nombre}" loading="lazy">
        ${badges}
      </a>
      <div class="card-body">
        <div class="meta"><span>${item.comuna}</span><span>•</span><span>${item.sector}</span></div>
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <div class="price-row"><strong>${item.precio || 'Consultar'}</strong><span>${item.categoria}</span></div>
        <div class="service-list">${servicios}</div>
      </div>
      <div class="card-actions">
        <a class="btn btn-secondary" href="/negocio.html?slug=${encodeURIComponent(item.slug)}" onclick="localStorage.setItem('turistuble_selected_slug', '${item.slug}')">Ver ficha</a>
        ${item.whatsapp ? `<a class="btn btn-primary" href="https://wa.me/${item.whatsapp}" target="_blank" rel="noreferrer">WhatsApp</a>` : ''}
      </div>
    </article>
  `;
}

cargarHeroSlides();
cargarPublicaciones();
