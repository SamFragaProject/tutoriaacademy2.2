# 🚀 GUÍA: Desplegar y Compartir para Testing con ChatGPT

## 📋 OBJETIVO
Publicar tu proyecto en línea para que ChatGPT u otros agentes puedan acceder y detectar errores.

---

## 🌐 OPCIÓN 1: VERCEL (Recomendada - Gratis y Rápida)

### Paso 1: Instalar Vercel CLI
```powershell
npm install -g vercel
```

### Paso 2: Login en Vercel
```powershell
vercel login
```
- Se abrirá el navegador
- Ingresa con GitHub, GitLab o Email

### Paso 3: Desplegar
```powershell
# En el directorio del proyecto
vercel --prod
```

### Paso 4: Obtener URL
Vercel te dará una URL como:
```
https://tutoria-academy-xxxxx.vercel.app
```

### Paso 5: Compartir con ChatGPT
```
"Revisa mi aplicación en: https://tutoria-academy-xxxxx.vercel.app
Identifica errores de UI/UX, funcionalidad y accesibilidad"
```

---

## 🌐 OPCIÓN 2: NETLIFY (Alternativa Gratis)

### Paso 1: Instalar Netlify CLI
```powershell
npm install -g netlify-cli
```

### Paso 2: Login
```powershell
netlify login
```

### Paso 3: Build y Deploy
```powershell
npm run build
netlify deploy --prod --dir=dist
```

---

## 🌐 OPCIÓN 3: GITHUB PAGES (Si ya usas GitHub)

### Paso 1: Instalar gh-pages
```powershell
npm install --save-dev gh-pages
```

### Paso 2: Agregar scripts en package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Paso 3: Configurar vite.config.ts
```typescript
export default defineConfig({
  base: '/nombre-de-tu-repo/', // ⬅️ Importante
  // ... resto de configuración
})
```

### Paso 4: Desplegar
```powershell
npm run deploy
```

URL resultante:
```
https://tu-usuario.github.io/nombre-de-tu-repo/
```

---

## 🔍 OPCIÓN 4: USAR EXTENSIONES DE VSCode (Local)

### Extensiones Esenciales para Detectar Errores

#### 1. **ESLint** (YA INSTALADA probablemente)
- Detecta errores de sintaxis y estilo
- Instalación: Buscar "ESLint" en extensiones VSCode

#### 2. **Error Lens** 🌟 RECOMENDADA
- Muestra errores inline en el código
- Instalación:
  ```
  Ctrl+Shift+X → Buscar "Error Lens" → Install
  ```

#### 3. **SonarLint** 🌟 RECOMENDADA
- Detecta bugs, vulnerabilidades y code smells
- Análisis en tiempo real
- Instalación:
  ```
  Ctrl+Shift+X → Buscar "SonarLint" → Install
  ```

#### 4. **TypeScript Error Translator**
- Traduce errores de TypeScript a lenguaje simple
- Instalación:
  ```
  Ctrl+Shift+X → Buscar "TypeScript Error Translator" → Install
  ```

#### 5. **Code Spell Checker**
- Detecta errores ortográficos en código y comentarios
- Instalación:
  ```
  Ctrl+Shift+X → Buscar "Code Spell Checker" → Install
  ```

### Cómo Usar las Extensiones

#### Ver Errores en VSCode:
1. **Panel de Problemas**: `Ctrl+Shift+M`
   - Muestra todos los errores del proyecto
   - Filtrar por tipo (Error, Warning, Info)

2. **Error Lens**:
   - Muestra errores directamente en la línea de código
   - No necesita configuración adicional

3. **SonarLint**:
   - Analiza automáticamente mientras escribes
   - Ver reporte: `Ctrl+Shift+P` → "SonarLint: Show All Locations"

---

## 🤖 OPCIÓN 5: COMPARTIR CÓDIGO CON CHATGPT (Sin Deploy)

Si no quieres desplegar, puedes compartir tu código directamente:

### Método 1: GitHub Repository
```powershell
# 1. Crear repo en GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

Luego comparte con ChatGPT:
```
"Revisa mi proyecto en: https://github.com/tu-usuario/tu-repo
Enfócate en archivos de componentes de profesor"
```

### Método 2: Compartir Archivos Específicos
Copia el contenido de archivos clave y pégalos en ChatGPT:
```
"Revisa este componente de React y detecta errores:

[pegar código aquí]

Busca:
- Errores de TypeScript
- Memory leaks
- Problemas de rendimiento
- Malas prácticas
"
```

---

## 📊 EJECUTAR ANÁLISIS AUTOMÁTICO (Local)

### 1. Ejecutar TypeScript Check
```powershell
npx tsc --noEmit
```
Muestra todos los errores de tipos.

### 2. Ejecutar ESLint
```powershell
npm run lint
```
O si no existe el script:
```powershell
npx eslint . --ext .ts,.tsx
```

### 3. Build de Producción (Detecta errores)
```powershell
npm run build
```
Si hay errores, el build fallará y los mostrará.

### 4. Análisis de Bundle Size
```powershell
npm install -g vite-bundle-visualizer
vite-bundle-visualizer
```

---

## 🎯 RECOMENDACIÓN FINAL

### Para Testing con ChatGPT:
**MEJOR OPCIÓN: Vercel**
1. Instalar: `npm install -g vercel`
2. Desplegar: `vercel --prod`
3. Compartir URL con ChatGPT
4. Pedir análisis completo

### Para Testing Local Continuo:
**Instalar estas extensiones en VSCode:**
1. ✅ Error Lens
2. ✅ SonarLint
3. ✅ ESLint (si no está)
4. ✅ TypeScript Error Translator

### Comando Rápido de Testing:
```powershell
# Ejecutar todos los checks
npm run build && npx tsc --noEmit && npm run lint
```

---

## 📝 PLANTILLA PARA CHATGPT

Cuando tengas la URL pública, usa esta plantilla:

```
Hola ChatGPT, necesito que revises mi aplicación web:

URL: [tu-url-aqui]

Contexto:
- Aplicación: TutoriA Academy (Plataforma Educativa B2B)
- Stack: React 19 + TypeScript + Vite
- Rol a revisar: Profesor

Por favor analiza y detecta:

1. 🐛 Errores de Funcionalidad:
   - Botones que no funcionan
   - Navegación rota
   - Formularios con problemas
   - Datos que no se muestran correctamente

2. 🎨 Errores de UI/UX:
   - Problemas de responsive
   - Elementos mal alineados
   - Colores o contrastes inadecuados
   - Tipografía inconsistente

3. ♿ Errores de Accesibilidad:
   - Falta de alt en imágenes
   - Contraste de colores insuficiente
   - Navegación por teclado
   - ARIA labels faltantes

4. ⚡ Errores de Rendimiento:
   - Carga lenta
   - Componentes pesados
   - Memory leaks potenciales

5. 🔒 Errores de Seguridad:
   - Validaciones faltantes
   - XSS potencial
   - Datos sensibles expuestos

Rutas principales para revisar:
- /docente/dashboard
- /docente/grupos
- /docente/examenes
- /docente/calificaciones
- /docente/screening

Proporciona:
- Lista de errores encontrados (priorizados)
- Ubicación exacta (URL + elemento)
- Sugerencias de corrección
- Código de ejemplo si es necesario
```

---

## ✅ CHECKLIST ANTES DE COMPARTIR

- [ ] Ejecutar `npm run build` sin errores
- [ ] Ejecutar `npx tsc --noEmit` sin errores de tipos
- [ ] Verificar que el servidor local funciona: http://localhost:3002
- [ ] Probar manualmente las rutas principales
- [ ] Desplegar a Vercel/Netlify
- [ ] Verificar que la URL pública funciona
- [ ] Compartir URL con ChatGPT usando la plantilla

---

## 🆘 SOLUCIÓN RÁPIDA SI HAY PROBLEMAS

### Error en Build:
```powershell
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Error en Deploy:
```powershell
# Vercel
vercel --debug

# Netlify
netlify deploy --debug
```

### Ver logs de Vercel:
```powershell
vercel logs [deployment-url]
```

---

**Autor:** Sistema de Testing TutoriA Academy  
**Fecha:** 22/10/2025  
**Versión:** 1.0
