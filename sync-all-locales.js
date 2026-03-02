const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'assets', 'locales');
const TEMPLATE_PATH = path.join(__dirname, 'Template', 'Languaje.json');
const PLACEHOLDER = 'abcde';

// Leer JSON
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Escribir JSON bonito
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Obtener todas las rutas de claves (recursivamente)
function getAllPaths(obj, prefix = '') {
  const paths = [];

  for (const key in obj) {
    const pathKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      paths.push(...getAllPaths(obj[key], pathKey));
    } else {
      paths.push(pathKey);
    }
  }

  return paths;
}

// Insertar una ruta en un objeto si no existe
function insertPath(obj, pathStr, value) {
  const keys = pathStr.split('.');
  let current = obj;
  keys.forEach((key, index) => {
    if (!(key in current)) {
      current[key] = (index === keys.length - 1) ? value : {};
    }
    current = current[key];
  });
}

function syncLocales() {
  const localeFiles = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));

  const fileData = localeFiles.map(file => ({
    name: file,
    path: path.join(LOCALES_DIR, file),
    content: readJson(path.join(LOCALES_DIR, file))
  }));

  // Leer también Template/Languaje.json
  const templateJson = readJson(TEMPLATE_PATH);
  const templatePaths = getAllPaths(templateJson);

  // Unir todas las claves de todos los archivos + template
  const allPaths = new Set(templatePaths);
  fileData.forEach(({ content }) => {
    getAllPaths(content).forEach(p => allPaths.add(p));
  });

  // Revisar cada archivo y completar con claves faltantes
  fileData.forEach(({ name, path: filePath, content }) => {
    const contentPaths = new Set(getAllPaths(content));
    let updated = false;

    allPaths.forEach(p => {
      if (!contentPaths.has(p)) {
        insertPath(content, p, PLACEHOLDER);
        updated = true;
        console.log(`➕ Añadida clave faltante '${p}' en ${name}`);
      }
    });

    if (updated) {
      writeJson(filePath, content);
      console.log(`✅ ${name} actualizado`);
    } else {
      console.log(`✔️  ${name} ya estaba completo`);
    }
  });
}

// Ejecutar
syncLocales();
