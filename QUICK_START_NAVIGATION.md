# 🚀 Guía Rápida de Inicio - Sistema de Navegación

## ¿Qué se implementó?

Un sistema completo de **onboarding y navegación** que guía a los usuarios desde su primera visita hasta que dominan la plataforma.

---

## 🎯 Para Probar AHORA

### Opción 1: Usuario Completamente Nuevo

1. **Limpia el almacenamiento** (para simular usuario nuevo):
   - Abre DevTools (F12)
   - Application tab → LocalStorage
   - Elimina todo lo que empiece con `onboarding:` o `userJourney:`

2. **Inicia sesión** como estudiante:
   ```
   Email: maria.prepa@escuela.com
   Password: preparatoria123
   ```

3. **Observa la magia** ✨:
   - Modal de **OnboardingTour** aparece automáticamente
   - Breadcrumbs en el header
   - Widget flotante **NavigationHelper** en esquina inferior derecha
   - **GettingStartedCard** en el dashboard

### Opción 2: Usuario Profesor

1. Inicia sesión como profesor:
   ```
   Email: profe.carlos@escuela.com
   Password: docente123
   ```

2. Verás pasos de onboarding específicos para profesores:
   - Crear grupos
   - Crear examen con IA
   - Asignar tareas
   - Sistema de calificaciones
   - Hub de comunicación

---

## 🧩 Componentes Principales

### 1. **OnboardingTour** (Modal guiado)
- Se muestra **solo la primera vez**
- Pasos personalizados según el rol
- Navegación adelante/atrás
- Botón "Ir a esta sección" lleva directo a cada paso

**Para volver a verlo**:
```javascript
// En consola del navegador:
localStorage.clear();
location.reload();
```

### 2. **NavigationHelper** (Widget flotante)
- Esquina inferior derecha
- Clic para expandir/contraer
- Muestra:
  - 🎯 Siguiente acción sugerida
  - ⚡ Acciones rápidas (4 botones)
  - 💡 Tips de la página actual
  - 📊 Progreso de onboarding

**Controles**:
- Clic en ícono = Expandir
- X = Minimizar
- Flecha arriba/abajo = Expandir/contraer contenido

### 3. **Breadcrumbs** (Navegación)
- Header superior
- Muestra ruta actual
- Links clicables
- Ejemplo: `Home > Portal Docente > Calificaciones`

### 4. **GettingStartedCard** (Dashboard)
- Solo aparece si progreso < 100%
- Lista de 5 tareas principales
- Barra de progreso
- Botón "Continuar configuración"
- Se puede cerrar con X

### 5. **ContextualHelp** (Ayuda)
- Botón azul con ? en páginas complejas
- Tips específicos de cada sección
- Links a videos y docs

---

## 📱 Interfaz del Usuario

### En Desktop (>768px)
```
┌─────────────────────────────────────────────────────────┐
│  [🏠 Home > Dashboard]              [@Usuario] [🌙]    │ ← Header con Breadcrumbs
├─────────────────────────────────────────────────────────┤
│ Sidebar  │  Contenido Principal                         │
│          │                                               │
│  • Home  │  ┌──────────────────────────┐               │
│  • Chat  │  │  GettingStartedCard      │               │
│  • Stats │  │  (si progreso < 100%)    │               │
│          │  └──────────────────────────┘               │
│          │                                               │
│          │  [Resto del contenido...]                    │
│          │                                         │
│          │                           ┌─────────┐  │
│          │                           │ [🧭]    │  │ ← NavigationHelper
│          │                           │  Nav    │  │
└──────────┴───────────────────────────└─────────┘──┘
```

### En Mobile (<768px)
```
┌─────────────────────────────┐
│  [☰]            [@] [🌙]   │ ← Header (sin breadcrumbs)
├─────────────────────────────┤
│                             │
│  Contenido Full Width       │
│                             │
│                             │
│                   ┌───────┐ │
│                   │ [🧭] │ │ ← NavigationHelper
└───────────────────└───────┘─┘
```

---

## 🎮 Interacciones Clave

### Completar un Paso del Onboarding

1. **En OnboardingTour**:
   - Haz clic en "Ir a esta sección"
   - Te lleva a la página
   - Paso se marca como ✅ completado

2. **En GettingStartedCard**:
   - Haz clic en cualquier tarea
   - Te lleva directo a esa página
   - Progreso se actualiza automáticamente

### Usar el NavigationHelper

1. **Minimizado** (solo ícono):
   - Clic → Se expande

2. **Expandido**:
   - Ves sugerencia principal destacada
   - 4 acciones rápidas en grid
   - Tips de la página actual
   - Progreso de onboarding

3. **Acciones**:
   - Clic en cualquier acción rápida → Navega a esa página
   - X → Minimiza
   - ↑↓ → Expande/contrae contenido

### Breadcrumbs

- Cada segmento es clickeable
- Clic en "Home" → Va a raíz
- Clic en segmento intermedio → Va a esa ruta
- Último segmento NO es clickeable (página actual)

---

## 🔧 Personalización

### Agregar Nuevo Paso de Onboarding

Edita `services/userJourney.ts`:

```typescript
export const ONBOARDING_STEPS: Record<string, OnboardingStep[]> = {
  alumno: [
    // ... pasos existentes
    {
      id: 'mi-nuevo-paso',
      title: 'Mi Nuevo Paso',
      description: 'Descripción del paso',
      route: '/app/mi-ruta',
      icon: 'book',
      completed: false,
      optional: false, // true si es opcional
    },
  ],
};
```

### Agregar Sugerencias para Nueva Página

```typescript
export const PAGE_SUGGESTIONS: Record<string, string[]> = {
  '/app/mi-pagina': [
    '💡 Tip 1: Haz esto primero',
    '🎯 Tip 2: Para mejores resultados...',
    '✨ Tip 3: No olvides...',
  ],
};
```

### Agregar Acción Rápida

```typescript
export const QUICK_ACTIONS: Record<string, Array<...>> = {
  alumno: [
    // ... acciones existentes
    { 
      label: 'Mi Acción', 
      icon: 'star', // emoji
      route: '/app/ruta', 
      description: 'Qué hace' 
    },
  ],
};
```

### Agregar Nombre de Ruta en Breadcrumbs

Edita `components/Breadcrumbs.tsx`:

```typescript
const ROUTE_NAMES: Record<string, string> = {
  // ... existentes
  'mi-ruta': 'Mi Página',
};
```

---

## 🐛 Solución Rápida de Problemas

### OnboardingTour no aparece

**Causa**: Ya lo viste o progreso es 100%

**Solución**:
```javascript
// En consola del navegador:
localStorage.removeItem('onboarding:USER_ID:seen');
localStorage.removeItem('userJourney:USER_ID');
location.reload();
```

### NavigationHelper no muestra sugerencias

**Causa**: Página no tiene sugerencias definidas

**Solución**: Agrega sugerencias en `services/userJourney.ts` → `PAGE_SUGGESTIONS`

### Breadcrumbs muestra nombre feo

**Causa**: Ruta no está en `ROUTE_NAMES`

**Solución**: Agregar en `components/Breadcrumbs.tsx` → `ROUTE_NAMES`

### GettingStartedCard no desaparece

**Causa**: Progreso no llegó a 100%

**Solución**: Completa todos los pasos obligatorios o ciérrala manualmente (X)

---

## 📊 Tracking de Progreso

### Ver Estado Actual

Abre consola del navegador:

```javascript
// Ver estado del journey
const state = JSON.parse(localStorage.getItem('userJourney:USER_ID'));
console.log(state);

// Ver progreso
console.log('Completados:', state.completedSteps);
console.log('Paso actual:', state.currentStep);
console.log('¿Terminado?:', state.onboardingCompleted);
```

### Resetear Progreso

```javascript
// Resetear TODO (simula usuario nuevo)
localStorage.clear();

// Resetear solo onboarding
localStorage.removeItem('onboarding:USER_ID:seen');
localStorage.removeItem('userJourney:USER_ID');
localStorage.removeItem('gettingStarted:USER_ID:dismissed');
```

---

## 📚 Documentación Completa

Para información detallada, consulta:

📄 **`docs/NAVIGATION_SYSTEM.md`** (800+ líneas)
- Arquitectura completa
- Todos los componentes
- Guía de personalización
- Mejores prácticas

📄 **`docs/NAVIGATION_IMPLEMENTATION_SUMMARY.md`**
- Resumen ejecutivo
- Métricas de impacto
- Instrucciones de prueba

---

## ✨ Funcionalidades Destacadas

### 1. Detección Automática de Nuevos Usuarios
El sistema detecta si es tu primera vez y te guía automáticamente.

### 2. Persistencia Inteligente
Tu progreso se guarda en `localStorage` y persiste entre sesiones.

### 3. Personalización por Rol
Cada rol (alumno, profesor, director) tiene su propio flujo.

### 4. Sugerencias Contextuales
Cada página tiene tips específicos y relevantes.

### 5. Animaciones Suaves
Todo está animado con Framer Motion para una experiencia premium.

### 6. Responsive Design
Funciona perfecto en desktop, tablet y móvil.

---

## 🎯 Siguiente Sesión

La aplicación está corriendo en **http://localhost:3000/**

1. **Prueba el sistema** siguiendo las instrucciones arriba
2. **Feedback**: Anota qué te gusta y qué mejorarías
3. **Personaliza**: Ajusta textos, pasos o sugerencias
4. **Deploy**: Cuando estés listo, el sistema está production-ready

---

## 🚀 Comando Útil

```bash
# Ver archivos del sistema
ls components/OnboardingTour.tsx
ls components/NavigationHelper.tsx
ls components/Breadcrumbs.tsx
ls components/GettingStartedCard.tsx
ls components/ContextualHelp.tsx
ls services/userJourney.ts

# Ver documentación
cat docs/NAVIGATION_SYSTEM.md
cat docs/NAVIGATION_IMPLEMENTATION_SUMMARY.md
```

---

**¡Disfruta explorando el nuevo sistema de navegación!** 🎉
