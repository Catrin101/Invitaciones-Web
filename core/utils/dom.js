/**
 * dom.js — Gudino Dev Invitation Framework
 * Utilidades para manipulación del DOM
 */

/**
 * Crea un elemento DOM con atributos y contenido opcional
 * @param {string} tag - Etiqueta HTML
 * @param {Object} attrs - Atributos del elemento
 * @param {string|Element} content - Contenido interno (texto o elemento)
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, content = null) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    }
    else el.setAttribute(key, value);
  });
  if (content) {
    if (typeof content === 'string') el.innerHTML = content;
    else el.appendChild(content);
  }
  return el;
}

/**
 * Selecciona un elemento o lanza error si no existe
 * @param {string} selector - Selector CSS
 * @param {Element} context - Contexto de búsqueda (default: document)
 * @returns {Element}
 */
export function select(selector, context = document) {
  const el = context.querySelector(selector);
  if (!el) throw new Error(`Elemento no encontrado: ${selector}`);
  return el;
}

/**
 * Selecciona múltiples elementos
 * @param {string} selector - Selector CSS
 * @param {Element} context - Contexto de búsqueda
 * @returns {Element[]}
 */
export function selectAll(selector, context = document) {
  return [...context.querySelectorAll(selector)];
}

/**
 * Añade clase(s) a un elemento
 * @param {Element|string} el - Elemento o selector
 * @param {string|string[]} classes - Clases a añadir
 */
export function addClass(el, classes) {
  const element = typeof el === 'string' ? select(el) : el;
  const classList = Array.isArray(classes) ? classes : classes.split(/\s+/);
  element.classList.add(...classList);
}

/**
 * Remueve clase(s) de un elemento
 * @param {Element|string} el - Elemento o selector
 * @param {string|string[]} classes - Clases a remover
 */
export function removeClass(el, classes) {
  const element = typeof el === 'string' ? select(el) : el;
  const classList = Array.isArray(classes) ? classes : classes.split(/\s+/);
  element.classList.remove(...classList);
}

/**
 * Alterna clase(s) en un elemento
 * @param {Element|string} el - Elemento o selector
 * @param {string} className - Clase a alternar
 * @param {boolean} force - Forzar estado (opcional)
 */
export function toggleClass(el, className, force) {
  const element = typeof el === 'string' ? select(el) : el;
  element.classList.toggle(className, force);
}

/**
 * Espera a que el DOM esté listo
 * @param {Function} fn - Callback
 */
export function onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Espera a que ocurra un evento en un elemento
 * @param {Element} el - Elemento
 * @param {string} event - Nombre del evento
 * @returns {Promise<Event>}
 */
export function once(el, event) {
  return new Promise(resolve => {
    const handler = e => {
      el.removeEventListener(event, handler);
      resolve(e);
    };
    el.addEventListener(event, handler, { once: true });
  });
}
