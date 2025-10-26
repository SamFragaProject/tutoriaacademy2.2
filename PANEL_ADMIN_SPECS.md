#  PANEL DE ADMINISTRACIÓN - Especificaciones Completas

##  VISIÓN GENERAL

El Panel de Administración es el centro de control maestro de TutoriA Academy. Permite al administrador:
- Ver y gestionar TODOS los datos del sistema
- Crear/editar/eliminar cualquier entidad
- Monitorear actividad en tiempo real
- Ver analytics avanzados
- Configurar el sistema

---

##  ESTRUCTURA DEL PANEL

### Rutas Admin:
```
/admin
 /admin/inicio (Dashboard principal)
 /admin/usuarios (Gestión de usuarios)
 /admin/escuelas (Gestión de instituciones)
 /admin/contenido (Todo el contenido del sistema)
 /admin/analytics (Estadísticas avanzadas)
 /admin/actividad (Logs y actividad reciente)
 /admin/configuracion (Settings del sistema)
```

---

## 1 DASHBOARD PRINCIPAL (/admin/inicio)

### KPIs Principales:
```typescript
const kpis = [
  {
    title: 'Usuarios Totales',
    value: totalUsers,
    change: '+12% vs mes pasado',
    icon: Users,
    breakdown: {
      admin: 2,
      director: 15,
      profesor: 245,
      alumno: 3450
    }
  },
  {
    title: 'Escuelas Activas',
    value: activeSchools,
    change: '+3 este mes',
    icon: Building
  },
  {
    title: 'Contenido Creado',
    value: totalContent,
    change: '+89 esta semana',
    icon: BookOpen
  },
  {
    title: 'Actividad Diaria',
    value: dailyActiveUsers,
    change: '82% engagement',
    icon: Activity
  }
];
```

### Gráficas:
- **Usuarios por tiempo**: Línea mostrando crecimiento
- **Actividad por rol**: Barras comparativas
- **Contenido más usado**: Top 10
- **Rendimiento general**: Promedio de calificaciones

### Alertas del Sistema:
-  Errores recientes
-  Nuevas inscripciones pendientes aprobación
-  Métricas fuera del rango normal
-  Intentos de login fallidos

---

## 2 GESTIÓN DE USUARIOS (/admin/usuarios)

### Vista de Lista:
```typescript
interface AdminUserListView {
  filters: {
    rol: 'todos' | 'admin' | 'director' | 'profesor' | 'alumno';
    escuela: string | 'all';
    estado: 'activo' | 'inactivo' | 'bloqueado';
    busqueda: string;
  };
  
  columns: [
    'ID',
    'Nombre',
    'Email',
    'Rol',
    'Escuela',
    'Fecha Registro',
    'Último Acceso',
    'Estado',
    'Acciones'
  ];
  
  acciones: [
    'Ver Perfil',
    'Editar',
    'Cambiar Rol',
    'Bloquear/Desbloquear',
    'Eliminar',
    'Ver Actividad'
  ];
}
```

### Modal de Creación/Edición:
```typescript
interface UserFormFields {
  // Básico
  nombre: string;
  email: string;
  password?: string; // Solo en creación
  rol: 'admin' | 'director' | 'profesor' | 'alumno';
  
  // Detalles
  escuela_id?: string; // Si aplica
  avatar_url?: string;
  telefono?: string;
  
  // Permisos especiales (solo admin)
  permisos: {
    puede_crear_escuelas: boolean;
    puede_eliminar_usuarios: boolean;
    puede_ver_analytics: boolean;
  };
}
```

### Vista de Perfil Detallado:
- Información personal completa
- Historial de actividad (últimas 100 acciones)
- Contenido creado (si es profesor)
- Progreso (si es estudiante)
- Grupos asignados
- Timeline de eventos

---

## 3 GESTIÓN DE ESCUELAS (/admin/escuelas)

### Vista de Lista:
```typescript
interface SchoolListView {
  columns: [
    'Logo',
    'Nombre',
    'Director',
    'Profesores',
    'Estudiantes',
    'Plan',
    'Estado',
    'Acciones'
  ];
}
```

### Modal de Creación/Edición:
```typescript
interface SchoolForm {
  nombre: string;
  logo_url?: string;
  director_id: string; // Select de usuarios con rol director
  
  contacto: {
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    pais: string;
  };
  
  suscripcion: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    limites: {
      max_profesores: number;
      max_estudiantes: number;
      max_storage_gb: number;
    };
    fecha_inicio: Date;
    fecha_fin?: Date;
  };
  
  configuracion: {
    logo_en_reportes: boolean;
    notificaciones_habilitadas: boolean;
    idioma_predeterminado: 'es' | 'en';
  };
}
```

### Dashboard por Escuela:
Al hacer click en una escuela, ver:
- Estadísticas de la institución
- Lista de profesores
- Lista de estudiantes
- Grupos activos
- Contenido más usado
- Rendimiento promedio

---

## 4 GESTIÓN DE CONTENIDO (/admin/contenido)

### Tabs:
1. **Exámenes**: Todos los exámenes del sistema
2. **Tareas**: Todas las tareas asignadas
3. **Prácticas**: Contenido de práctica
4. **Plantillas**: Templates reutilizables

### Vista de Lista:
```typescript
interface ContentListView {
  filters: {
    tipo: 'examen' | 'tarea' | 'practica' | 'repaso';
    materia: string;
    profesor_id: string;
    escuela_id: string;
    estado: 'draft' | 'published' | 'archived';
    fecha_desde: Date;
    fecha_hasta: Date;
  };
  
  columns: [
    'Título',
    'Tipo',
    'Profesor',
    'Materia',
    'Grupo',
    'Estudiantes Asignados',
    'Completados',
    'Promedio',
    'Fecha Creación',
    'Estado',
    'Acciones'
  ];
}
```

### Acciones:
- Ver detalles completos
- Editar (como profesor)
- Duplicar
- Archivar
- Eliminar (con confirmación)
- Ver submissions
- Exportar resultados (Excel/PDF)

---

## 5 ANALYTICS AVANZADOS (/admin/analytics)

### Secciones:

#### A. Métricas de Uso:
- Usuarios activos diarios/semanales/mensuales (DAU/WAU/MAU)
- Tiempo promedio en plataforma
- Features más usados
- Rutas más visitadas
- Tasa de retención

#### B. Métricas Educativas:
- Rendimiento promedio por escuela
- Rendimiento promedio por materia
- Rendimiento promedio por profesor
- Identificar temas difíciles (heat map)
- Progreso por nivel/grado

#### C. Métricas de Contenido:
- Exámenes creados por mes
- Tareas asignadas por mes
- Tiempo promedio de creación
- Contenido más duplicado
- Plantillas más usadas

#### D. Gráficas Interactivas:
- Líneas de tiempo comparativas
- Barras agrupadas por criterios
- Pie charts de distribución
- Heat maps de rendimiento
- Scatter plots de correlaciones

#### E. Exportación:
- Botones para exportar cualquier gráfica
- Formatos: PNG, PDF, Excel, CSV
- Reportes programados (futurono)

---

## 6 ACTIVIDAD Y LOGS (/admin/actividad)

### Log de Actividad:
```typescript
interface ActivityLog {
  id: string;
  timestamp: Date;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string; // 'create', 'update', 'delete', 'login', 'logout', etc.
  entity_type: string; // 'user', 'content', 'exam', 'group', etc.
  entity_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}
```

### Vista:
- Timeline visual
- Filtros por usuario, acción, entidad, fecha
- Búsqueda full-text
- Paginación infinita
- Detalles expandibles

### Eventos Trackeados:
- Login/Logout
- Creación de usuarios/contenido/exámenes
- Edición de cualquier entidad
- Eliminación (soft/hard delete)
- Cambios de configuración
- Errores del sistema
- Intentos de acceso no autorizado

---

## 7 CONFIGURACIÓN (/admin/configuracion)

### Tabs:

#### A. General:
- Nombre del sistema
- Logo
- Favicon
- Colores del tema (primario, secundario)
- Idioma predeterminado

#### B. Email:
- Provider (Resend, SendGrid, etc.)
- API Key
- Email remitente
- Templates de emails

#### C. Integraciones:
- Google Gemini AI (API Key)
- OneSignal (Push notifications)
- Google Analytics
- Sentry (Error tracking)

#### D. Límites y Quotas:
- Max usuarios por plan
- Max storage por escuela
- Max requests por minuto (rate limiting)
- Tiempo de sesión

#### E. Seguridad:
- Forzar 2FA para admins
- Longitud mínima de password
- Expiración de sesiones
- IPs permitidas (whitelist)
- Logs de auditoría

#### F. Mantenimiento:
- Modo mantenimiento (on/off)
- Mensaje personalizado
- Limpiar cache
- Limpiar logs antiguos
- Backup manual de DB

---

##  DISEÑO Y UX

### Estilo:
- Usar **Neo-Glass** como en TeacherDashboard
- Sidebar colapsible con 7 opciones
- Header con breadcrumbs, búsqueda global, notificaciones, perfil
- Tema oscuro por defecto (toggle disponible)

### Componentes Reutilizables:
```typescript
<AdminKpiCard icon={Icon} title="..." value="..." change="..." />
<AdminDataTable data={[]} columns={[]} actions={[]} />
<AdminModal title="..." onSave={} onCancel={} />
<AdminChart type="line|bar|pie" data={[]} />
<AdminActivityLog events={[]} />
<AdminUserCard user={user} onEdit={} onDelete={} />
```

### Navegación:
```typescript
const adminNavItems = [
  { icon: LayoutDashboard, label: 'Inicio', path: '/admin/inicio' },
  { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
  { icon: Building, label: 'Escuelas', path: '/admin/escuelas' },
  { icon: FileText, label: 'Contenido', path: '/admin/contenido' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Activity, label: 'Actividad', path: '/admin/actividad' },
  { icon: Settings, label: 'Configuración', path: '/admin/configuracion' }
];
```

---

##  PERMISOS

### Roles y Acceso:
```typescript
const adminPermissions = {
  'super-admin': {
    can_view_all: true,
    can_edit_all: true,
    can_delete_all: true,
    can_change_system_config: true,
  },
  'admin': {
    can_view_all: true,
    can_edit_all: true,
    can_delete_users: false, // Solo super-admin
    can_change_system_config: false,
  }
};
```

---

##  PRIORIDADES DE IMPLEMENTACIÓN

### Fase 1 (CRÍTICO): 
1.  Dashboard principal con KPIs
2.  Gestión básica de usuarios (CRUD)
3.  Vista de todas las escuelas

### Fase 2 (IMPORTANTE):
4.  Gestión de contenido (view only)
5.  Analytics básicos
6.  Log de actividad

### Fase 3 (MEJORAR):
7.  Configuración del sistema
8.  Exportaciones avanzadas
9.  Notificaciones en tiempo real

---

##  PRÓXIMOS PASOS

1. Crear `pages/AdminPages.tsx` con las 7 páginas
2. Crear componentes en `components/admin/`
3. Crear servicios en `services/admin/`
4. Conectar con Supabase
5. Testing exhaustivo

---

**¿Empezamos con el código del panel?** 

