const telefonoTuristuble = '569XXXXXXXX';
const form = document.querySelector('#formPublicar');
const preview = document.querySelector('#previewMensaje');
const copiarBtn = document.querySelector('#copiarMensaje');
const menuToggle = document.querySelector('#menuToggle');
const navActions = document.querySelector('#navActions');

const campos = [
  'tipoPublicacion', 'nombre', 'categoria', 'subcategoria', 'provincia', 'comuna', 'sector',
  'direccion', 'referencia', 'maps', 'whatsapp', 'email', 'instagram', 'facebook', 'descripcion'
];

if (menuToggle && navActions) {
  menuToggle.addEventListener('click', () => navActions.classList.toggle('open'));
}

function valor(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function generarMensaje() {
  return `Hola, quiero publicar en Turistuble.

Tipo de publicación: ${valor('tipoPublicacion')}
Nombre: ${valor('nombre')}
Categoría: ${valor('categoria')}
Subcategoría: ${valor('subcategoria')}
Región: Ñuble
Provincia: ${valor('provincia')}
Comuna: ${valor('comuna')}
Sector: ${valor('sector')}
Dirección: ${valor('direccion')}
Referencia: ${valor('referencia')}
Ubicación Google Maps: ${valor('maps')}
WhatsApp: ${valor('whatsapp')}
Email: ${valor('email')}
Instagram: ${valor('instagram')}
Facebook: ${valor('facebook')}

Descripción:
${valor('descripcion')}

Plan solicitado: ${valor('tipoPublicacion') === 'Evento' ? 'Comunidad gratis' : 'Emprendedor $5.990 mensual'}`;
}

function actualizarPreview() {
  const mensaje = generarMensaje();
  preview.textContent = mensaje;
  return mensaje;
}

function aplicarTipo(tipo) {
  if (tipo === 'Evento' || tipo === 'Negocio') {
    document.querySelector('#tipoPublicacion').value = tipo;
    actualizarPreview();
  }
}

function aplicarParametroInicial() {
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get('tipo');
  if (tipo === 'evento') aplicarTipo('Evento');
  if (tipo === 'negocio') aplicarTipo('Negocio');
}

campos.forEach(id => {
  const element = document.querySelector(`#${id}`);
  element.addEventListener('input', actualizarPreview);
  element.addEventListener('change', actualizarPreview);
});

document.querySelectorAll('[data-set-type]').forEach(button => {
  button.addEventListener('click', () => aplicarTipo(button.dataset.setType));
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const mensaje = actualizarPreview();
  const url = `https://wa.me/${telefonoTuristuble}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank', 'noreferrer');
});

copiarBtn.addEventListener('click', async () => {
  const mensaje = actualizarPreview();
  try {
    await navigator.clipboard.writeText(mensaje);
    copiarBtn.textContent = 'Copiado';
    setTimeout(() => copiarBtn.textContent = 'Copiar mensaje', 1500);
  } catch (error) {
    preview.focus();
    alert('No se pudo copiar automáticamente. Puedes seleccionar el texto manualmente.');
  }
});

aplicarParametroInicial();
actualizarPreview();
