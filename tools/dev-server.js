/**
 * dev-server.js — Servidor de Desarrollo para Invitaciones Web
 * 
 * Uso:
 *   npm run dev
 * 
 * Servidor local con las siguientes características:
 * - Sirve archivos estáticos
 * - Soporta ES modules
 * - Auto-reload no implementado (versión básica)
 */

import { createServer } from 'http';
import { createReadStream, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(fileURLToPath(import.meta.url), '..');
const ROOT = join(__dirname, '..');

// Configuración
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

/**
 * Obtiene el MIME type de un archivo
 */
function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Maneja las peticiones HTTP
 */
function handleRequest(req, res) {
  const url = req.url === '/' ? '/index.html' : req.url;
  
  // Quitar parámetros de query
  const cleanUrl = url.split('?')[0];
  
  // Construir path absoluto
  let filePath = join(ROOT, cleanUrl);
  
  // Security: prevenir directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  // Verificar si el archivo existe
  if (!existsSync(filePath)) {
    // Intentar con index.html en la carpeta
    const indexPath = join(filePath, 'index.html');
    if (existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
  }
  
  // Verificar que sea archivo (no directorio)
  const stats = statSync(filePath);
  if (stats.isDirectory()) {
    const indexPath = join(filePath, 'index.html');
    if (existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      res.writeHead(403);
      res.end('Directory listing not allowed');
      return;
    }
  }
  
  // Servir archivo
  const mimeType = getMimeType(filePath);
  res.writeHead(200, {
    'Content-Type': mimeType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
  });
  
  const stream = createReadStream(filePath);
  stream.pipe(res);
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${url} - ${res.statusCode}`);
}

/**
 * Imprime información del servidor
 */
function printServerInfo() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎉 Invitaciones Web - Servidor de Desarrollo            ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   Servidor corriendo en:                                  ║
║   ➜  http://${HOST}:${PORT}/                            ║
║                                                           ║
║   Invitaciones disponibles:                               ║
║   ➜  http://${HOST}:${PORT}/invitations/isabella-mateo-2026/  ║
║   ➜  http://${HOST}:${PORT}/invitations/valentina-xv/         ║
║                                                           ║
║   Templates:                                              ║
║   ➜  http://${HOST}:${PORT}/templates/boda/                   ║
║   ➜  http://${HOST}:${PORT}/templates/xv/                     ║
║                                                           ║
║   Presiona Ctrl+C para detener                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

/**
 * Inicia el servidor
 */
function startServer() {
  const server = createServer(handleRequest);
  
  server.listen(PORT, HOST, () => {
    printServerInfo();
  });
  
  // Manejo de errores
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Puerto ${PORT} ya está en uso`);
      console.log('Intenta con: PORT=3001 npm run dev');
    } else {
      console.error('❌ Error del servidor:', err);
    }
    process.exit(1);
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Deteniendo servidor...');
    server.close(() => {
      console.log('Servidor detenido');
      process.exit(0);
    });
  });
}

// Iniciar servidor
startServer();
