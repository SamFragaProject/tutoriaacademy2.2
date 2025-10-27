# 📋 INSTRUCCIONES PARA EJECUTAR SQL EN SUPABASE

## 🎯 Objetivo
Crear las 10 tablas necesarias para el sistema de profesores y alumnos.

---

## ✅ PASO 1: Abrir Supabase Dashboard

1. Abre tu navegador
2. Ve a: **https://supabase.com/dashboard/project/ohtgbmqpudepbavjxrek**
3. Si pide login, usa tus credenciales de Supabase

---

## ✅ PASO 2: Ir al SQL Editor

1. En el menú de la izquierda, busca **"SQL Editor"** (icono de base de datos)
2. Click en **"SQL Editor"**
3. Click en el botón **"+ New query"** (arriba a la derecha)

---

## ✅ PASO 3: Ejecutar Schema (Crear Tablas)

### 3.1 Copiar el SQL

1. Abre el archivo: `supabase_schema_fase4.sql`
2. Selecciona **TODO** el contenido (Ctrl+A)
3. Copia (Ctrl+C)

### 3.2 Pegar y Ejecutar

1. En el SQL Editor de Supabase, pega el código (Ctrl+V)
2. Verifica que se pegó correctamente (deberías ver muchas líneas de código)
3. Click en **"Run"** (botón verde) o presiona **Ctrl+Enter**
4. **ESPERA** 10-15 segundos (es normal que tarde)

### 3.3 Verificar Éxito

✅ Si todo salió bien verás:
- Mensaje verde "Success" o "Completed"
- Pueden aparecer algunos "already exists" (es normal)

❌ Si hay error:
- Lee el mensaje de error
- Verifica que copiaste TODO el archivo
- Intenta de nuevo

---

## ✅ PASO 4: Ejecutar Seed (Datos Demo)

### 4.1 Nueva Query

1. Click en **"+ New query"** (nueva pestaña)
2. Abre el archivo: `supabase_seed_fase4.sql`
3. Selecciona TODO (Ctrl+A)
4. Copia (Ctrl+C)

### 4.2 Pegar y Ejecutar

1. Pega en la nueva pestaña del SQL Editor
2. Click en **"Run"** o Ctrl+Enter
3. Espera 5-10 segundos

### 4.3 Verificar Éxito

✅ Mensaje de éxito
✅ Pueden aparecer "duplicate key" (significa que ya existían, es OK)

---

## ✅ PASO 5: Verificar que Funcionó

### 5.1 Crear Nueva Query de Verificación

1. **"+ New query"** otra vez
2. Copia y pega este código de verificación:

```sql
-- Verificar tablas y contar registros
SELECT 
  (SELECT COUNT(*) FROM grupos) as total_grupos,
  (SELECT COUNT(*) FROM grupos_alumnos) as inscripciones,
  (SELECT COUNT(*) FROM tareas) as total_tareas,
  (SELECT COUNT(*) FROM examenes) as total_examenes,
  (SELECT COUNT(*) FROM calificaciones) as total_calificaciones,
  (SELECT COUNT(*) FROM asistencias) as total_asistencias,
  (SELECT COUNT(*) FROM mensajes) as total_mensajes;
```

3. Click en "Run"

### 5.2 Resultado Esperado

Deberías ver una tabla con números, por ejemplo:
```
total_grupos: 3
inscripciones: 10
total_tareas: 5
...
```

✅ Si ves números > 0: **¡PERFECTO!**  
❌ Si todos son 0: El seed no se ejecutó, repite paso 4

---

## 🎯 CHECKLIST FINAL

Marca cuando completes cada paso:

- [ ] ✅ Paso 1: Dashboard abierto
- [ ] ✅ Paso 2: SQL Editor abierto
- [ ] ✅ Paso 3: Schema ejecutado (tablas creadas)
- [ ] ✅ Paso 4: Seed ejecutado (datos insertados)
- [ ] ✅ Paso 5: Verificación exitosa (números > 0)

---

## 🆘 AYUDA SI HAY PROBLEMAS

### Error: "permission denied"
- **Causa**: No tienes permisos
- **Solución**: Usa una cuenta con permisos de admin en Supabase

### Error: "relation already exists"
- **Causa**: La tabla ya existe
- **Solución**: Es normal, continúa. O ejecuta esto primero:
  ```sql
  DROP TABLE IF EXISTS mensajes CASCADE;
  DROP TABLE IF EXISTS asistencias CASCADE;
  DROP TABLE IF EXISTS calificaciones CASCADE;
  DROP TABLE IF EXISTS resultados_examenes CASCADE;
  DROP TABLE IF EXISTS preguntas CASCADE;
  DROP TABLE IF EXISTS examenes CASCADE;
  DROP TABLE IF EXISTS entregas CASCADE;
  DROP TABLE IF EXISTS tareas CASCADE;
  DROP TABLE IF EXISTS grupos_alumnos CASCADE;
  DROP TABLE IF EXISTS grupos CASCADE;
  ```

### Error: "foreign key constraint"
- **Causa**: Faltan tablas base (usuarios, escuelas)
- **Solución**: Primero ejecuta `supabase_schema.sql` (el schema base)

---

## ⏱️ TIEMPO ESTIMADO

- Paso 1-2: 1 minuto
- Paso 3: 2 minutos
- Paso 4: 1 minuto
- Paso 5: 1 minuto

**TOTAL: 5 minutos** ⚡

---

## 📸 Cuando Termines

Toma screenshot de la verificación (paso 5) y envíamela para confirmar que todo funcionó.

**¡Suerte! 🚀**
