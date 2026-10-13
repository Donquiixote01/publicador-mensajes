'use strict';

/* ---------- 1. Configuración ---------- */

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

/* ---------- 2. Referencias al DOM (se obtienen una sola vez) ---------- */

const form = document.querySelector('#post-form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const submitButton = document.querySelector('#submit-button');
const messageElement = document.querySelector('#message');
const resultSection = document.querySelector('#result');
const resultId = document.querySelector('#result-id');
const resultTitle = document.querySelector('#result-title');
const resultBody = document.querySelector('#result-body');

/* ---------- 3. Estado de la aplicación ---------- */

let isSubmitting = false;

/* ---------- 4. Funciones de interfaz (solo tocan el DOM) ---------- */

function showMessage(text, type) {
  messageElement.textContent = text;
  messageElement.className = `message message--${type}`;
}

function setLoading(loading) {
  isSubmitting = loading;
  submitButton.disabled = loading;
  submitButton.textContent = loading ? 'Publicando…' : 'Publicar';
}

function renderResult(post) {
  resultId.textContent = post.id;
  resultTitle.textContent = post.title;
  resultBody.textContent = post.body;
  resultSection.hidden = false;
}

function hideResult() {
  resultSection.hidden = true;
}

/* ---------- 5. Validación (sin DOM, solo datos) ---------- */

function validate(title, body) {
  if (title === '' && body === '') {
    return 'Completa el título y el contenido antes de publicar.';
  }
  if (title === '') {
    return 'El título no puede estar vacío ni contener solo espacios.';
  }
  if (body === '') {
    return 'El contenido no puede estar vacío ni contener solo espacios.';
  }
  if (title.length < 3) {
    return 'El título debe tener al menos 3 caracteres.';
  }
  return null;
}

/* ---------- 6. Acceso a la API ---------- */

function createError(message, kind) {
  const error = new Error(message);
  error.kind = kind;
  return error;
}

async function publishPost(post) {
  let response;

  // a) Error de conexión: fetch rechaza la promesa (sin red, DNS, CORS).
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
  } catch (networkError) {
    throw createError(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
      'conexion'
    );
  }

  // b) Error HTTP: fetch NO rechaza con 404 o 500, hay que comprobar response.ok.
  if (!response.ok) {
    throw createError(
      `El servidor respondió con el estado ${response.status} ${response.statusText}.`,
      'http'
    );
  }

  // c) Error de interpretación: el cuerpo no es JSON válido.
  try {
    return await response.json();
  } catch (parseError) {
    throw createError('El servidor respondió, pero el cuerpo no es un JSON válido.', 'json');
  }
}

/* ---------- 7. Controlador del envío ---------- */

async function handleSubmit(event) {
  event.preventDefault(); // evita que el navegador recargue la página

  if (isSubmitting) {
    return; // evita envíos repetidos
  }

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  const validationError = validate(title, body);
  if (validationError !== null) {
    hideResult();
    showMessage(validationError, 'error');
    return;
  }

  hideResult();
  setLoading(true);
  showMessage('Enviando la publicación…', 'carga');

  try {
    const createdPost = await publishPost({ title, body, userId: 1 });
    renderResult(createdPost);
    showMessage(`Publicación creada correctamente con el ID ${createdPost.id}.`, 'exito');
    form.reset();
  } catch (error) {
    showMessage(error.message, 'error');
    console.error('[Publicador] tipo de error:', error.kind, error);
  } finally {
    setLoading(false); // restablece el botón incluso si hubo error
  }
}

/* ---------- 8. Registro del evento ---------- */

form.addEventListener('submit', handleSubmit);