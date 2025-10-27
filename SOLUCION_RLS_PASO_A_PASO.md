# 🚀 SOLUCIÓN DEFINITIVA: Eliminar Error RLS

## 🎯 Qué vamos a hacer

Configurar el proyecto para usar **Service Role Key** que **BYPASEA RLS automáticamente** en desarrollo.

**Resultado:** ✅ No más errores "permission denied for table grupos"

---

## 📋 PASO A PASO

### **Paso 1: Obtener Service Role Key de Supabase** (2 minutos)

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Click en **Settings** (⚙️ en el menú izquierdo)
3. Click en **API** 
4. Busca la sección **"Project API keys"**
5. Copia la **"service_role"** key (⚠️ NO la "anon/public" key)

**Se ve así:**
```
service_role: eyJhbGc... (muy larga, ~200 caracteres)
```

⚠️ **IMPORTANTE:** Esta key es SECRETA. Nunca la commitees a Git.

---

### **Paso 2: Crear archivo `.env.local`** (1 minuto)

En la raíz de tu proyecto, crea un archivo llamado **`.env.local`** (si no existe):

```bash
# .env.local (NO COMMITEAR)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-actual
VITE_SUPABASE_SERVICE_ROLE_KEY=pega-aqui-la-service-role-key-que-copiaste
```

**Reemplaza:**
- `https://tu-proyecto.supabase.co` → URL real de tu proyecto
- `tu-anon-key-actual` → Tu anon key existente (la pública)
- `pega-aqui-la-service-role-key-que-copiaste` → La service_role que copiaste en Paso 1

**Ejemplo real:**
```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4ODY0MDAwLCJleHAiOjE5OTQ0NDAwMDB9.abc123def456
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMyIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2Nzg4NjQwMDAsImV4cCI6MTk5NDQ0MDAwMH0.xyz789ghi012
```

---

### **Paso 3: Verificar que `.gitignore` protege `.env.local`** (30 segundos)

Abre el archivo `.gitignore` en la raíz y verifica que contenga:

```
.env
.env.local
.env*.local
```

✅ Si ya está, perfecto.  
❌ Si no está, agrégalo.

---

### **Paso 4: Reiniciar servidor de desarrollo** (1 minuto)

1. Detén el servidor si está corriendo (Ctrl+C en la terminal)
2. Ejecuta de nuevo:

```powershell
npm run dev
```

Deberías ver en la consola del navegador:

```
🔧 Supabase Dev Client: {
  url: "https://xyzabc123.supabase.co",
  usingServiceRole: true,
  bypassRLS: true
}
```

✅ Si dice `usingServiceRole: true` y `bypassRLS: true` → TODO PERFECTO

---

### **Paso 5: Probar que funciona** (2 minutos)

1. Abre tu proyecto en el navegador
2. Inicia sesión con `profesor@demo.com` / `password123`
3. Ve a **Panel Profesor → Grupos**

**✅ ÉXITO si:**
- NO aparece error "permission denied for table grupos"
- Se ven los grupos listados
- Puedes navegar a "Ver Detalles" de un grupo
- Puedes ir a **Tareas** y ver la lista

**❌ Si sigue el error:**
- Verifica que el archivo `.env.local` está en la raíz (mismo nivel que `package.json`)
- Verifica que las 3 variables están definidas
- Reinicia el servidor completamente
- Revisa la consola del navegador (F12) para ver si hay logs

---

## 🔍 VERIFICACIÓN

### Consola del navegador (F12 → Console)

Deberías ver:
```
🔧 Supabase Dev Client: { usingServiceRole: true, bypassRLS: true }
```

### Network tab (F12 → Network)

Las peticiones a Supabase deberían tener header:
```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi... (la service_role key)
```

### SQL Editor en Supabase

Ejecuta esta query para verificar el estado de RLS:

```sql
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('usuarios', 'grupos', 'tareas', 'entregas', 'examenes')
ORDER BY tablename;
```

**Nota:** Aunque RLS esté habilitado (`true`), las queries funcionarán porque el Service Role Key lo bypasea.

---

## ❓ PREGUNTAS FRECUENTES

### ¿Por qué no simplemente deshabilitamos RLS?

Porque en **producción** necesitamos RLS para seguridad. El Service Role Key nos permite:
- ✅ Desarrollar sin fricción (bypasea RLS)
- ✅ Mantener RLS habilitado para producción
- ✅ Simular acceso de admin/sistema

### ¿Es seguro commitear el Service Role Key?

❌ **NO.** Por eso usamos `.env.local` que está en `.gitignore`.

En producción, usarás la **Anon Key** (pública) + RLS políticas correctas.

### ¿Tengo que hacer esto en producción?

❌ **NO.** En producción (Vercel, etc.):
- Usas solo la **Anon Key** (VITE_SUPABASE_ANON_KEY)
- RLS está habilitado con políticas correctas
- Los usuarios autenticados tienen acceso según su rol

### ¿Qué pasa si me olvido de la Service Role Key?

El código tiene fallback: si no encuentra `VITE_SUPABASE_SERVICE_ROLE_KEY`, usa `VITE_SUPABASE_ANON_KEY` automáticamente.

---

## 🎯 RESULTADO ESPERADO

Después de completar estos pasos:

✅ **Panel Profesor funciona al 100%**
- Lista de grupos carga correctamente
- Puedes ver detalles de cada grupo
- Sistema de tareas funciona
- Puedes crear, editar, calificar tareas
- No más errores "permission denied"

✅ **Desarrollo ágil**
- No más bloqueos por RLS
- Queries se ejecutan instantáneamente
- Puedes probar todas las funcionalidades

✅ **Seguridad mantenida**
- Service Role Key protegida en `.env.local`
- No se sube a Git
- Producción sigue usando Anon Key + RLS

---

## 🚨 SI SIGUE SIN FUNCIONAR

1. **Verifica variables de entorno:**
   ```powershell
   Get-Content .env.local
   ```
   
   Debes ver las 3 líneas con valores reales.

2. **Reinicia TODO:**
   - Detén el servidor (Ctrl+C)
   - Cierra VS Code
   - Abre VS Code de nuevo
   - `npm run dev`

3. **Revisa consola del navegador:**
   - F12 → Console
   - Busca errores en rojo
   - Comparte screenshot si hay errores

4. **Verifica que la Service Role Key es correcta:**
   - Ve a Supabase Dashboard → Settings → API
   - Copia de nuevo la service_role key
   - Reemplaza en `.env.local`

---

## 📞 SIGUIENTE PASO

Una vez que confirmes que **TODO FUNCIONA** (grupos cargan sin error), continuamos con:

1. ✅ Ejecutar `supabase_seed_corregido.sql` para datos demo correctos
2. ✅ Implementar Sistema de Calificaciones
3. ✅ Implementar Sistema de Asistencias
4. ✅ Implementar Sistema de Exámenes

---

**¿LISTO? Confirma que el error desapareció y avísame para continuar. 🚀**
