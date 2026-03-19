/**
 * format.js — Gudino Dev Invitation Framework
 * Utilidades para formateo de datos
 */

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale (default: 'es-ES')
 * @param {Object} options - Opciones de Intl.DateTimeFormat
 * @returns {string}
 */
export function formatDate(date, locale = 'es-ES', options = {}) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return d.toLocaleDateString(locale, { ...defaultOptions, ...options });
}

/**
 * Formatea una hora
 * @param {string|Date} date - Fecha con hora
 * @param {string} locale - Locale
 * @returns {string}
 */
export function formatTime(date, locale = 'es-ES') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea fecha y hora combinados
 * @param {string|Date} date - Fecha
 * @param {string} locale - Locale
 * @returns {string}
 */
export function formatDateTime(date, locale = 'es-ES') {
  return `${formatDate(date, locale)} · ${formatTime(date, locale)}`;
}

/**
 * Formatea número con ceros a la izquierda
 * @param {number} num - Número
 * @param {number} length - Longitud mínima
 * @returns {string}
 */
export function pad(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - Texto
 * @returns {string}
 */
export function capitalize(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Trunca texto a una longitud máxima
 * @param {string} str - Texto
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo (default: '...')
 * @returns {string}
 */
export function truncate(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Genera URL de WhatsApp con mensaje prellenado
 * @param {string} number - Número de teléfono
 * @param {string} message - Mensaje
 * @returns {string}
 */
export function createWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera URL de Google Maps
 * @param {string} query - Búsqueda o dirección
 * @returns {string}
 */
export function createMapsUrl(query) {
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

/**
 * Calcula diferencia entre dos fechas
 * @param {string|Date} target - Fecha objetivo
 * @param {string|Date} source - Fecha de origen (default: now)
 * @returns {Object} { days, hours, minutes, seconds, total }
 */
export function dateDiff(target, source = new Date()) {
  const t = typeof target === 'string' ? new Date(target) : target;
  const s = typeof source === 'string' ? new Date(source) : source;
  const diff = t - s;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    total: diff,
    expired: false,
  };
}
