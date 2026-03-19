/**
 * build.js — Sistema de Build para Invitaciones Web
 * Genera el build de producción de todas las invitaciones o una específica
 * 
 * Uso:
 *   npm run build                      # Build todas las invitaciones
 *   npm run build:invitation -- --name=isabella-mateo-2026  # Build individual
 */

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Carpetas
const TEMPLATES_DIR = join(ROOT, 'templates');
const INVITATIONS_DIR = join(ROOT, 'invitations');
const PUBLIC_DIR = join(ROOT, 'public');

/**
 * Lee un archivo JSON
 */
function readJSON(path) {
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content);
}

/**
 * Escribe un archivo JSON
 */
function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Copia archivos recursivamente
 */
function copyRecursive(src, dest) {
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
  }
  
  if (!existsSync(src)) return;
  
  const stat = statSync(src);
  if (stat.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      copyRecursive(
        join(src, entry.name),
        join(dest, entry.name)
      );
    }
  } else {
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    copyFileSync(src, dest);
  }
}

/**
 * Genera el HTML final para una invitación
 */
function generateInvitationHTML(invitationName, templateName) {
  const templateIndexPath = join(TEMPLATES_DIR, templateName, 'index.html');
  
  if (!existsSync(templateIndexPath)) {
    console.warn(`Template index.html no encontrado: ${templateIndexPath}`);
    return null;
  }
  
  let html = readFileSync(templateIndexPath, 'utf-8');
  
  // Actualizar paths para que apunten correctamente desde public/{invitation}
  html = html.replace(
    /href="\.\.\/\.\.\/templates\//g,
    'href="../templates/'
  );
  html = html.replace(
    /href="\.\.\/\.\.\/core\//g,
    'href="../core/'
  );
  html = html.replace(
    /src="\.\.\/\.\.\/templates\//g,
    'src="../templates/'
  );
  html = html.replace(
    /src="\.\.\/\.\.\/core\//g,
    'src="../core/'
  );
  
  return html;
}

/**
 * Procesa una invitación individual
 */
function processInvitation(invitationName) {
  const invitationDir = join(INVITATIONS_DIR, invitationName);
  const publicInvitationDir = join(PUBLIC_DIR, invitationName);
  
  if (!existsSync(invitationDir)) {
    console.error(`❌ Invitación no encontrada: ${invitationName}`);
    return false;
  }
  
  console.log(`\n📦 Procesando: ${invitationName}`);
  
  // Leer configuración
  const eventConfig = readJSON(join(invitationDir, 'config', 'event.json'));
  const themeConfig = readJSON(join(invitationDir, 'config', 'theme.json'));
  
  // Determinar template (por defecto 'boda' si no se especifica)
  const templateName = themeConfig.template?.name?.includes('boda') ? 'boda' : 
                       themeConfig.theme?.name?.includes('xv') ? 'xv' : 'boda';
  
  console.log(`   Template: ${templateName}`);
  
  // Crear directorio de salida
  if (existsSync(publicInvitationDir)) {
    rmSync(publicInvitationDir, { recursive: true, force: true });
  }
  mkdirSync(publicInvitationDir, { recursive: true });
  
  // Copiar assets de la invitación
  const invitationAssetsDir = join(invitationDir, 'assets');
  if (existsSync(invitationAssetsDir)) {
    copyRecursive(invitationAssetsDir, join(publicInvitationDir, 'assets'));
    console.log(`   ✓ Assets copiados`);
  }
  
  // Copiar config fusionado
  const mergedConfig = { ...eventConfig, ...themeConfig };
  writeJSON(join(publicInvitationDir, 'config.json'), mergedConfig);
  console.log(`   ✓ Configuración fusionada`);
  
  // Generar HTML
  const html = generateInvitationHTML(invitationName, templateName);
  if (html) {
    writeFileSync(join(publicInvitationDir, 'index.html'), html, 'utf-8');
    console.log(`   ✓ HTML generado`);
  }
  
  return true;
}

/**
 * Copia el core y los templates al directorio public
 */
function copySharedResources() {
  const coreDir = join(ROOT, 'core');
  const templatesDir = TEMPLATES_DIR;
  
  // Copiar core
  if (existsSync(coreDir)) {
    copyRecursive(coreDir, join(PUBLIC_DIR, 'core'));
    console.log('✓ Core copiado');
  }
  
  // Copiar templates usados
  const usedTemplates = new Set();
  const invitations = readdirSync(INVITATIONS_DIR);
  
  for (const invitation of invitations) {
    const invitationDir = join(INVITATIONS_DIR, invitation);
    if (!existsSync(join(invitationDir, 'config', 'theme.json'))) continue;
    
    const themeConfig = readJSON(join(invitationDir, 'config', 'theme.json'));
    const templateName = themeConfig.template?.name?.includes('boda') ? 'boda' : 
                         themeConfig.theme?.name?.includes('xv') ? 'xv' : 'boda';
    usedTemplates.add(templateName);
  }
  
  for (const templateName of usedTemplates) {
    const templateDir = join(templatesDir, templateName);
    if (existsSync(templateDir)) {
      copyRecursive(templateDir, join(PUBLIC_DIR, 'templates', templateName));
      console.log(`✓ Template ${templateName} copiado`);
    }
  }
}

/**
 * Build principal
 */
function build(options = {}) {
  const { invitationName = null } = options;
  
  console.log('🚀 Iniciando build...\n');
  
  // Limpiar public
  if (existsSync(PUBLIC_DIR)) {
    rmSync(PUBLIC_DIR, { recursive: true, force: true });
  }
  mkdirSync(PUBLIC_DIR);
  
  // Copiar recursos compartidos
  copySharedResources();

  // Copiar .htaccess si existe
  const htaccessSrc = join(ROOT, 'tools', '.htaccess');
  if (existsSync(htaccessSrc)) {
    copyFileSync(htaccessSrc, join(PUBLIC_DIR, '.htaccess'));
    console.log('✓ .htaccess copiado');
  }

  // Procesar invitaciones
  let invitations = [];
  
  if (invitationName) {
    invitations = [invitationName];
  } else {
    invitations = readdirSync(INVITATIONS_DIR)
      .filter(name => existsSync(join(INVITATIONS_DIR, name, 'config')));
  }
  
  console.log(`\n📋 Invitaciones a procesar: ${invitations.length}`);
  
  let successCount = 0;
  for (const invitation of invitations) {
    if (processInvitation(invitation)) {
      successCount++;
    }
  }
  
  console.log(`\n✅ Build completado: ${successCount}/${invitations.length} invitaciones`);
  console.log(`📁 Output: ${PUBLIC_DIR}`);
}

// Parsear argumentos de línea de comandos
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--invitation' && args[i + 1]?.startsWith('--name=')) {
    options.invitationName = args[i + 1].replace('--name=', '');
    i++;
  }
}

// Ejecutar build
build(options);
