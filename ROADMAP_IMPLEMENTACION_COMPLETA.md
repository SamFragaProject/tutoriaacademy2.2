# 🚀 ROADMAP COMPLETO - TutoriA Academy 100%

## 🎯 **OBJETIVO**

Implementar TODA la funcionalidad para tener un sistema 100% profesional, dejando solo las API keys para configurar después.

---

## 📋 **FASES DE IMPLEMENTACIÓN**

### **FASE 1: Panel Super Admin (Días 1-3)**

#### **1.1 Dashboard Super Admin**
```typescript
// pages/AdminPages.tsx - Expansión completa

Features:
✅ Dashboard principal con:
  - Total de usuarios (estudiantes/profesores/admins)
  - Total de escuelas activas
  - Usuarios activos hoy/semana/mes
  - Gráficas de crecimiento
  - Actividad reciente
  - Alertas del sistema
```

#### **1.2 Gestión de Usuarios**
```typescript
// components/admin/UserManagement.tsx - NUEVO

Features:
✅ Lista de todos los usuarios
  - Tabla con: Nombre, Email, Rol, Escuela, Grupo, Estado, Último acceso
  - Filtros: Por rol, escuela, grupo, activo/inactivo
  - Búsqueda por nombre/email
  - Paginación (50 por página)
  - Ordenar por cualquier columna

✅ Crear usuario individual
  - Modal con form completo
  - Campos: email, nombre, apellido, contraseña, rol
  - Seleccionar escuela (dropdown)
  - Seleccionar grupo(s) (multi-select)
  - Toggle: Enviar email de bienvenida
  - Toggle: Forzar cambio de contraseña en primer login

✅ Editar usuario
  - Modal con datos pre-llenados
  - Editar cualquier campo
  - Cambiar rol
  - Cambiar escuela/grupos
  - Ver última actividad

✅ Acciones por usuario
  - Botón "Acciones" con dropdown:
    - Ver perfil completo
    - Editar información
    - Resetear contraseña (genera nueva)
    - Activar/Desactivar cuenta
    - Eliminar usuario (con confirmación doble)
    - Ver historial de actividad
    - Hacerse pasar por usuario (impersonate)

✅ Acciones masivas
  - Checkboxes para seleccionar múltiples
  - Acciones en grupo:
    - Cambiar escuela
    - Cambiar grupo
    - Activar/Desactivar
    - Exportar a CSV
    - Eliminar (con confirmación)
```

#### **1.3 Carga Masiva CSV**
```typescript
// components/admin/BulkImportUsers.tsx - NUEVO

Features:
✅ Botón "Importar Usuarios" en UserManagement
✅ Modal de importación:
  - Paso 1: Descargar template CSV
  - Paso 2: Upload archivo
  - Paso 3: Validación automática
  - Paso 4: Preview de primeros 10 usuarios
  - Paso 5: Mostrar errores si hay
  - Paso 6: Confirmar importación
  - Paso 7: Progress bar
  - Paso 8: Reporte final

✅ Validaciones:
  - Formato CSV correcto
  - Emails válidos y únicos
  - Roles válidos
  - Escuelas existen
  - Grupos existen
  - Contraseñas seguras (si se proveen)

✅ Generación automática:
  - Contraseñas seguras si no se proveen
  - Usernames si no se proveen
  - IDs únicos

✅ Reporte de importación:
  - Total procesados
  - Exitosos
  - Fallidos (con razón)
  - Descargar reporte completo CSV
```

**Template CSV:**
```csv
email,firstName,lastName,password,role,gradeLevel,schoolId,groupIds
juan@example.com,Juan,Pérez,Pass123!,student,preparatoria,school-1,group-1
maria@example.com,María,García,,student,preparatoria,school-1,group-1;group-2
profe@example.com,Carlos,López,Profe456!,teacher,,school-1,
admin@example.com,Ana,Martínez,Admin789!,admin,,,
```

---

### **FASE 2: Multi-Escuela (Días 4-5)**

#### **2.1 Gestión de Escuelas**
```typescript
// components/admin/SchoolManagement.tsx - NUEVO

Features:
✅ Lista de escuelas
  - Tabla: Nombre, Director, Total estudiantes, Total profesores, Estado
  - Filtros: Activas/Inactivas, Por ciudad
  - Búsqueda por nombre
  - Estadísticas por escuela

✅ Crear escuela
  - Nombre de la escuela
  - Dirección
  - Ciudad, Estado, CP
  - Teléfono, Email
  - Asignar director (dropdown de usuarios con rol teacher)
  - Logo de la escuela (upload imagen)

✅ Editar escuela
  - Modificar cualquier dato
  - Cambiar director
  - Ver usuarios de la escuela

✅ Estadísticas por escuela
  - Total de estudiantes
  - Total de profesores
  - Promedio de XP
  - Juegos más jugados
  - Horas de estudio
  - Gráficas de progreso
```

#### **2.2 Jerarquía de Datos**
```typescript
// Estructura en Firebase:

/schools/{schoolId}
  - name
  - address
  - director (userId)
  - active
  - createdAt

/groups/{groupId}
  - name
  - schoolId
  - teacherId
  - studentIds[]
  - subject

/users/{userId}
  - schoolId
  - groupIds[]
  - role
```

---

### **FASE 3: Firebase Integration (Días 6-9)**

#### **3.1 Migrar Autenticación**
```typescript
// contexts/AuthContext.tsx - Actualizar

Migrar de localStorage a Firebase Auth:
✅ createUserWithEmailAndPassword()
✅ signInWithEmailAndPassword()
✅ signOut()
✅ onAuthStateChanged()
✅ sendPasswordResetEmail()
✅ updateProfile()

Mantener misma interfaz para no romper componentes
```

#### **3.2 Migrar Datos**
```typescript
// services/ - Actualizar todos

Migrar a Firestore:
✅ userManagement.ts → /users collection
✅ gameScores.ts → /gameScores collection
✅ gamification.ts → /users/{uid}/gamification
✅ progress.ts → /users/{uid}/progress
✅ schools.ts → /schools collection
✅ groups.ts → /groups collection
✅ agenda.ts → /users/{uid}/agenda
✅ srs.ts → /users/{uid}/srs

Con listeners en tiempo real
```

#### **3.3 Security Rules**
```javascript
// firestore.rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isTeacher() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    function isSelf(userId) {
      return request.auth.uid == userId;
    }
    
    function isSchoolDirector(schoolId) {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/schools/$(schoolId)).data.director == request.auth.uid;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAdmin() || isSelf(userId) || isTeacher();
      allow create: if isAdmin();
      allow update: if isAdmin() || isSelf(userId);
      allow delete: if isAdmin();
      
      // Sub-collections
      match /gamification/{doc=**} {
        allow read: if isAdmin() || isSelf(userId) || isTeacher();
        allow write: if isAdmin() || isSelf(userId);
      }
      
      match /progress/{doc=**} {
        allow read: if isAdmin() || isSelf(userId) || isTeacher();
        allow write: if isAdmin() || isSelf(userId);
      }
    }
    
    // Schools
    match /schools/{schoolId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isSchoolDirector(schoolId);
    }
    
    // Groups
    match /groups/{groupId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isTeacher();
    }
    
    // Game Scores
    match /gameScores/{scoreId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin() || 
                              request.auth.uid == resource.data.userId;
    }
  }
}
```

---

### **FASE 4: Sistema de Permisos (Día 10)**

#### **4.1 Hook de Permisos**
```typescript
// hooks/usePermissions.ts - NUEVO

export const usePermissions = () => {
  const { user } = useAuth();
  
  const can = (action: string, resource?: any): boolean => {
    if (!user) return false;
    
    // Super Admin puede todo
    if (user.role === 'admin') return true;
    
    // Permisos específicos por rol
    switch (action) {
      case 'create:user':
        return user.role === 'admin';
      
      case 'edit:user':
        return user.role === 'admin' || 
               (resource && user.id === resource.id);
      
      case 'view:school':
        return user.role === 'admin' || 
               user.schoolId === resource?.id;
      
      case 'manage:group':
        return user.role === 'admin' || 
               user.role === 'teacher';
      
      // ... más permisos
    }
    
    return false;
  };
  
  return { can };
};

// Uso:
const { can } = usePermissions();
if (can('create:user')) {
  // Mostrar botón crear usuario
}
```

---

### **FASE 5: Reportes y Exportación (Día 11)**

#### **5.1 Exportar Datos**
```typescript
// components/admin/ExportData.tsx - NUEVO

Features:
✅ Exportar usuarios a CSV
✅ Exportar grupos a CSV
✅ Exportar estadísticas a Excel
✅ Generar reportes PDF
✅ Filtrar datos antes de exportar
✅ Programar reportes automáticos
```

#### **5.2 Generación de Reportes**
```typescript
// services/reports.ts - NUEVO

Tipos de reportes:
✅ Reporte de estudiante individual
✅ Reporte de grupo
✅ Reporte de escuela
✅ Reporte general del sistema
✅ Comparativa entre escuelas
✅ Ranking de estudiantes
```

---

### **FASE 6: Sistema de Logs (Día 12)**

#### **6.1 Auditoría**
```typescript
// services/auditLog.ts - NUEVO

Registrar:
✅ Creación de usuarios
✅ Edición de usuarios
✅ Eliminación de usuarios
✅ Cambios de rol
✅ Accesos al sistema
✅ Cambios de configuración
✅ Importaciones CSV
✅ Exportaciones de datos

Estructura:
{
  timestamp: Date,
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  changes: object,
  ipAddress: string,
  userAgent: string
}
```

---

### **FASE 7: Preparar APIs (Día 13)**

#### **7.1 Gemini API - Ready**
```typescript
// src/services/llm/geminiClient.ts - Ya existe

Ya está listo, solo falta:
- [ ] Agregar VITE_GEMINI_API_KEY en .env
- [ ] El código ya funciona
```

#### **7.2 Placeholders**
```typescript
// .env.example actualizado

# ===== GEMINI API =====
VITE_GEMINI_API_KEY=tu_api_key_aqui
# Obtener en: https://aistudio.google.com/app/apikey

# ===== FIREBASE =====
VITE_FIREBASE_API_KEY=tu_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx

# Instrucciones completas en: GUIA_SIMPLE_SETUP.md
```

---

### **FASE 8: Testing y Documentación (Día 14)**

#### **8.1 Testing Manual**
```
✅ Crear super admin
✅ Crear escuela
✅ Crear profesor
✅ Crear estudiante
✅ Cargar 100 usuarios por CSV
✅ Editar usuarios
✅ Eliminar usuarios
✅ Resetear contraseña
✅ Ver estadísticas
✅ Exportar reportes
✅ Verificar permisos
✅ Probar todos los juegos
✅ Verificar persistencia
```

#### **8.2 Documentación**
```
✅ Manual de Super Admin
✅ Guía de carga CSV
✅ Troubleshooting
✅ FAQ
✅ Video tutoriales (opcional)
```

---

## 📊 **CRONOGRAMA**

```
Día 1-3:   Panel Super Admin + Gestión Usuarios + CSV
Día 4-5:   Multi-Escuela + Jerarquía
Día 6-9:   Firebase Integration completa
Día 10:    Sistema de Permisos
Día 11:    Reportes y Exportación
Día 12:    Sistema de Logs
Día 13:    Preparar APIs (placeholders)
Día 14:    Testing + Documentación

Total: 14 días de desarrollo
```

---

## 🎯 **RESULTADO FINAL**

Al terminar tendrás:

✅ **Panel Super Admin completo**
  - Control total de la plataforma
  - Gestión de usuarios
  - Carga masiva CSV
  - Multi-escuela
  - Reportes y exportación

✅ **Firebase integrado**
  - Datos persistentes
  - Sincronización en tiempo real
  - Seguridad configurada
  - Backup automático

✅ **Sistema de permisos**
  - SuperAdmin: Control total
  - Director: Su escuela
  - Profesor: Sus grupos
  - Estudiante: Sus datos

✅ **Todo listo para APIs**
  - Solo agregar keys en .env
  - Código ya funcional

✅ **Listo para producción**
  - 1,000+ usuarios
  - Múltiples escuelas
  - Profesional

---

## 🚀 **EMPECEMOS**

**¿Confirmamos que arranco con la Fase 1?**

Voy a empezar implementando el **Panel Super Admin completo** con:
1. Dashboard con estadísticas
2. Gestión de usuarios CRUD
3. Carga masiva CSV

**¿Procedemos?** 🎯
