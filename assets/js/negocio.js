const detalle = document.querySelector('#detalle');
const params = new URLSearchParams(window.location.search);
const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
const slug = params.get('slug') || hashParams.get('slug') || localStorage.getItem('turistuble_selected_slug');

let carouselIndex = 0;
let carouselImages = [];

const menuToggle = document.querySelector('#menuToggle');
const navActions = document.querySelector('#navActions');
if (menuToggle && navActions) {
  menuToggle.addEventListener('click', () => navActions.classList.toggle('open'));
}


function normalizarRutaImagen(ruta) {
  if (!ruta) return '';
  if (ruta.startsWith('http') || ruta.startsWith('/')) return ruta;
  return '/' + ruta;
}

async function cargarFicha() {
  try {
    const response = await fetch('/assets/data/negocios.json');
    const publicaciones = await response.json();
    const item = publicaciones.find(publicacion => publicacion.slug === slug);

    if (!slug) {
      detalle.innerHTML = '<div class="empty-state">No se recibió el identificador de la publicación. Vuelve al inicio y presiona Ver ficha. Ruta esperada: /negocio.html?slug=cabanas-valle-las-trancas</div>';
      return;
    }

    if (!item) {
      detalle.innerHTML = '<div class="empty-state">Publicación no encontrada.</div>';
      return;
    }

    document.title = `${item.nombre} | Turistuble`;
    detalle.innerHTML = crearDetalle(item);
    inicializarCarrusel(item.imagenes || []);
  } catch (error) {
    console.error(error);
    detalle.innerHTML = '<div class="empty-state">No se pudo cargar la ficha. Usa un servidor local si estás abriendo el archivo directamente.</div>';
  }
}

function crearCarrusel(item) {
  const imagenes = (item.imagenes && item.imagenes.length ? item.imagenes : ['/assets/img/placeholder-nature.svg'])
    .map(normalizarRutaImagen);

  const thumbs = imagenes.map((imagen, index) => `
    <button class="carousel-thumb ${index === 0 ? 'active' : ''}" type="button" data-carousel-thumb="${index}" aria-label="Ver imagen ${index + 1}">
      <img src="${imagen}" alt="${item.nombre} imagen ${index + 1}">
    </button>
  `).join('');

  const controles = imagenes.length > 1 ? `
    <button class="carousel-control carousel-prev" type="button" data-carousel-prev aria-label="Imagen anterior">‹</button>
    <button class="carousel-control carousel-next" type="button" data-carousel-next aria-label="Imagen siguiente">›</button>
  ` : '';

  return `
    <div class="detail-carousel" data-carousel>
      <div class="carousel-main">
        <img id="carouselImage" src="${imagenes[0]}" alt="${item.nombre}">
        <div class="carousel-counter" id="carouselCounter">1 / ${imagenes.length}</div>
        ${controles}
      </div>
      ${imagenes.length > 1 ? `<div class="carousel-thumbs">${thumbs}</div>` : ''}
    </div>
  `;
}

function inicializarCarrusel(imagenes) {
  carouselImages = (imagenes && imagenes.length ? imagenes : ['/assets/img/placeholder-nature.svg']).map(normalizarRutaImagen);
  carouselIndex = 0;

  const prev = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  const thumbs = document.querySelectorAll('[data-carousel-thumb]');

  if (prev) prev.addEventListener('click', () => moverCarrusel(-1));
  if (next) next.addEventListener('click', () => moverCarrusel(1));
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => mostrarImagen(Number(thumb.dataset.carouselThumb)));
  });
}

function moverCarrusel(direccion) {
  if (!carouselImages.length) return;
  const nuevoIndex = (carouselIndex + direccion + carouselImages.length) % carouselImages.length;
  mostrarImagen(nuevoIndex);
}

function mostrarImagen(index) {
  carouselIndex = index;
  const image = document.querySelector('#carouselImage');
  const counter = document.querySelector('#carouselCounter');
  const thumbs = document.querySelectorAll('[data-carousel-thumb]');

  if (image) image.src = carouselImages[carouselIndex];
  if (counter) counter.textContent = `${carouselIndex + 1} / ${carouselImages.length}`;
  thumbs.forEach(thumb => {
    thumb.classList.toggle('active', Number(thumb.dataset.carouselThumb) === carouselIndex);
  });
}

function crearDetalle(item) {
  const servicios = (item.servicios || []).map(servicio => `<span>${servicio}</span>`).join('');
  const fechasEvento = item.fechaInicio ? `
    <div class="info-box"><strong>Fecha</strong><span>${item.fechaInicio}${item.fechaFin && item.fechaFin !== item.fechaInicio ? ' al ' + item.fechaFin : ''}</span></div>
    <div class="info-box"><strong>Horario</strong><span>${item.horaInicio || 'Por confirmar'}${item.horaFin ? ' a ' + item.horaFin : ''}</span></div>
  ` : '';

  return `
    <div class="detail-hero">
      ${crearCarrusel(item)}
      <div class="detail-content">
        <span class="eyebrow">${item.tipo} · ${item.categoria}</span>
        <h1>${item.nombre}</h1>
        <p>${item.descripcionLarga || item.descripcion}</p>
        <div class="meta"><span>${item.region}</span><span>•</span><span>${item.provincia}</span><span>•</span><span>${item.comuna}</span></div>
        <div class="detail-actions">
          ${item.whatsapp ? `<a class="btn btn-primary" href="https://wa.me/${item.whatsapp}" target="_blank" rel="noreferrer">Contactar por WhatsApp</a>` : ''}
          ${item.instagram ? `<a class="btn btn-secondary" href="${item.instagram}" target="_blank" rel="noreferrer">Instagram</a>` : ''}
          ${item.facebook ? `<a class="btn btn-secondary" href="${item.facebook}" target="_blank" rel="noreferrer">Facebook</a>` : ''}
          ${item.ubicacionGoogleMaps ? `<a class="btn btn-secondary" href="${item.ubicacionGoogleMaps}" target="_blank" rel="noreferrer">Ver ubicación</a>` : ''}
        </div>
        <div class="service-list">${servicios}</div>
        <div class="info-grid">
          <div class="info-box"><strong>Precio</strong><span>${item.precio || 'Consultar'}</span></div>
          <div class="info-box"><strong>Sector</strong><span>${item.sector || 'No informado'}</span></div>
          <div class="info-box"><strong>Dirección</strong><span>${item.direccion || 'No informada'}</span></div>
          <div class="info-box"><strong>Referencia</strong><span>${item.referencia || 'No informada'}</span></div>
          ${fechasEvento}
          <div class="info-box"><strong>Plan</strong><span>${item.plan}</span></div>
          <div class="info-box"><strong>Estado</strong><span>${item.estado}</span></div>
        </div>
      </div>
    </div>
  `;
}

cargarFicha();
