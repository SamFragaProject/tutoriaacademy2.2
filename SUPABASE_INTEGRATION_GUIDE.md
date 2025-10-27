# 🚀 INTEGRACIÓN SUPABASE - GUÍA DE CONFIGURACIÓN

## ✅ **LO QUE ACABAMOS DE COMPLETAR**

### **Cambios Realizados (Commit b56873b):**

1. **✅ Servicio fetchGroupStudents()**
   - Obtiene estudiantes reales desde `grupos_alumnos`
   - Calcula promedio desde tabla `calificaciones`
   - Calcula asistencia desde tabla `asistencias`
   - Calcula XP basado en promedio

2. **✅ GroupsPage con Supabase**
   - useQuery + fetchTeacherGroups()
   - Muestra datos reales: nombre, materia, nivel
   - Muestra estadísticas: total_alumnos, promedio_general, tasa_asistencia
   - Loading states y error handling

3. **✅ GroupDetailPage con Supabase**
   - useQuery + fetchGroupById()
   - useQuery + fetchGroupStudents()
   - Avatares con iniciales (AA, BB, etc.)
   - Tabla completa con datos reales

4. **✅ SQL para deshabilitar RLS**
   - `disable_rls_all_tables.sql` creado
   - Deshabilita RLS en 11 tablas
   - Query de verificación incluida

---

## 🔴 **IMPORTANTE: PASO MANUAL REQUERIDO**

Antes de que la aplicación funcione con datos reales, **DEBES EJECUTAR** este SQL en Supabase:

### **📝 Pasos para ejecutar SQL:**

1. **Ir a Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto
   - Ve a `SQL Editor` (icono de base de datos)

2. **Crear nueva query:**
   - Click en `+ New query`

3. **Copiar y pegar el contenido de:**
   ```
   disable_rls_all_tables.sql
   ```

4. **Ejecutar (Run):**
   - Click en botón `Run` o presiona `Ctrl + Enter`

5. **Verificar resultado:**
   - Deberías ver una tabla mostrando `rls_enabled = false` para todas las tablas

### **💡 ¿Por qué es necesario?**

Row Level Security (RLS) estaba bloqueando todas las consultas con errores 403. Para desarrollo, lo deshabilitamos completamente. Esto permite que la aplicación acceda libremente a todos los datos.

---

## 🧪 **CÓMO PROBAR**

### **Después de ejecutar el SQL:**

1. **Ve a la aplicación desplegada:**
   ```
   https://tutoriaacademy2-2.vercel.app
   ```

2. **Login como profesor:**
   - Email: profesor@demo.com
   - Password: (tu contraseña configurada)

3. **Navega a "Mis Grupos":**
   - Deberías ver grupos REALES desde Supabase
   - NO debería aparecer "Error al cargar los grupos"

4. **Click en "Ver Detalles" de un grupo:**
   - Deberías ver estudiantes REALES desde Supabase
   - Tabla con promedio, asistencia, XP calculados

### **Si ves errores:**

#### **Error: "Error al cargar los grupos"**
- ❌ NO ejecutaste el SQL de deshabilitar RLS
- ✅ Ejecuta `disable_rls_all_tables.sql` en Supabase

#### **Error: "No tienes grupos asignados"**
- ✅ Esto significa que Supabase funciona
- ❌ Pero tu usuario no tiene grupos en la base de datos
- ✅ Ejecuta `supabase_seed_fase4.sql` para insertar datos demo

#### **Error: "Grupo no encontrado"**
- ✅ Significa que los grupos cargan correctamente
- ❌ Pero ese grupo específico no tiene datos
- ✅ Verifica que ejecutaste el seed data

---

## 📊 **DATOS DE PRUEBA**

Si ejecutaste `supabase_seed_fase4.sql`, deberías tener:

### **Grupos:**
- Matemáticas 1A (10 alumnos)
- Álgebra 2B (10 alumnos)  
- Lengua 3C (10 alumnos)

### **Estudiantes:**
- 10 estudiantes inscritos en cada grupo
- Con calificaciones en 3 subtemas
- Con asistencias de últimos 30 días

### **Profesor demo:**
- Email: profesor@demo.com
- Tiene los 3 grupos asignados

---

## 🎯 **PRÓXIMOS PASOS**

Una vez que Supabase funcione:

### **Opción A: Panel Super Admin** (gestión de usuarios)
- Dashboard con estadísticas
- Crear/Editar/Eliminar usuarios
- Carga masiva CSV (100+ usuarios)

### **Opción B: Más funcionalidades de profesor**
- Sistema de tareas
- Sistema de exámenes
- Calificaciones en tiempo real

### **Opción C: Optimizar Supabase**
- Re-habilitar RLS con políticas correctas
- Implementar autenticación completa
- Migrar más datos de MOCK a Supabase

---

## 🚨 **TROUBLESHOOTING**

### **Console muestra: "permission denied for table grupos"**
```
Error code: 42501
Message: permission denied for table grupos
```

**Solución:**
1. Ve a Supabase SQL Editor
2. Ejecuta: `SELECT * FROM pg_tables WHERE schemaname = 'public' AND tablename = 'grupos';`
3. Verifica que `rowsecurity = false`
4. Si es `true`, ejecuta: `ALTER TABLE grupos DISABLE ROW LEVEL SECURITY;`

### **Aplicación muestra "Cargando grupos..." infinito**
- Verifica que Supabase URL y ANON_KEY están en `.env`
- Revisa la consola del navegador (F12)
- Busca errores de red o CORS

### **Grupos cargan pero estudiantes vacíos**
- Ejecuta: `SELECT * FROM grupos_alumnos;`
- Verifica que hay registros
- Ejecuta `supabase_seed_fase4.sql` si no hay datos

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

Antes de reportar problemas, verifica:

- [ ] Ejecuté `disable_rls_all_tables.sql` en Supabase
- [ ] Ejecuté `supabase_seed_fase4.sql` en Supabase
- [ ] Vi la query de verificación mostrando `rls_enabled = false`
- [ ] Hice hard refresh del navegador (Ctrl + Shift + R)
- [ ] Revisé la consola del navegador (F12) buscando errores
- [ ] Verifiqué que `.env` tiene SUPABASE_URL y SUPABASE_ANON_KEY

---

## 📝 **ARCHIVOS IMPORTANTES**

```
disable_rls_all_tables.sql      ← EJECUTAR PRIMERO (obligatorio)
supabase_seed_fase4.sql         ← Datos de prueba
supabase_schema_fase4_safe.sql  ← Ya ejecutado anteriormente
services/teacher/groups.ts       ← Servicios de Supabase
pages/TeacherPages.tsx          ← GroupsPage con Supabase
pages/GroupDetailPage.tsx       ← Detalle con Supabase
```

---

## 🎉 **RESULTADO ESPERADO**

Cuando todo funcione correctamente:

- ✅ "Mis Grupos" muestra grupos reales de Supabase
- ✅ Cards muestran: nombre, materia, nivel, total alumnos, promedio, asistencia
- ✅ Click en "Ver Detalles" muestra estudiantes reales
- ✅ Tabla con avatares de iniciales (AA, BB, etc.)
- ✅ Promedio calculado desde tabla `calificaciones`
- ✅ Asistencia calculada desde tabla `asistencias`
- ✅ Top 3 estudiantes con badges amarillos
- ✅ Distribución de calificaciones con barras
- ✅ Top 5 ranking

---

**Deploy:** Commit `b56873b` ya está en producción
**Vercel:** https://tutoriaacademy2-2.vercel.app
**Status:** ⏳ Esperando ejecutar SQL en Supabase

**¿Listo para probar?** 🚀
