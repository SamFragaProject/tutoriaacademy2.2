# 🎯 GUÍA RÁPIDA: SETUP SUPABASE COMPLETADO

## ✅ Lo que acabamos de hacer:

1. ✅ Instalamos `@supabase/supabase-js`
2. ✅ Configuramos credenciales en `.env.local`
3. ✅ Creamos cliente de Supabase (`src/lib/supabaseClient.ts`)
4. ✅ Creamos 12 tablas en la base de datos
5. ✅ Configuramos Row Level Security (RLS)
6. ✅ Implementamos AuthContext con Supabase
7. ✅ Creamos página de Login moderna

---

## 🔐 PRÓXIMO PASO: Crear Usuario de Prueba

### Necesitas crear un usuario manualmente para hacer login.

Ve a tu dashboard de Supabase y ejecuta esto:

**Dashboard → SQL Editor → New Query**

```sql
-- 1. Ir a Authentication → Users → Add User
-- Crear manualmente un usuario con:
-- Email: profesor@demo.com
-- Password: password123
-- (Guarda el UUID que se genera)

-- 2. Después ejecutar esto en SQL Editor (reemplaza el UUID):
INSERT INTO usuarios (
  id,
  escuela_id,
  nombre,
  apellidos,
  email,
  rol,
  activo
) VALUES (
  'UUID-DEL-USUARIO-QUE-CREASTE', -- ← Reemplazar con el UUID de auth.users
  '11111111-1111-1111-1111-111111111111', -- Escuela Demo
  'Profesor',
  'Demo',
  'profesor@demo.com',
  'profesor',
  true
);
```

---

## 🚀 OPCIÓN MÁS FÁCIL: Desactivar Email Confirmation

1. **Supabase Dashboard** → **Authentication** → **Settings**
2. Desactiva **"Enable email confirmations"**
3. **Save**

Ahora puedes crear usuarios desde el código sin verificar email.

---

## 📝 Crear usuario de prueba desde SQL:

```sql
-- Opción A: Usar función de Supabase para crear usuario
-- (Solo funciona si desactivaste email confirmation)

-- No disponible directamente en SQL
-- Mejor usa la UI: Authentication → Users → Add User

-- Después agrega los datos adicionales:
INSERT INTO usuarios (
  id,
  escuela_id,
  nombre,
  apellidos,
  email,
  rol,
  activo
) VALUES (
  'el-uuid-generado-por-supabase',
  '11111111-1111-1111-1111-111111111111',
  'Profesor',
  'Demo',
  'profesor@demo.com',
  'profesor',
  true
);
```

---

## ✅ CHECKLIST:

- [ ] Desactivar "Email Confirmation" en Supabase Auth Settings
- [ ] Crear usuario en Authentication → Users → Add User
- [ ] Email: `profesor@demo.com`
- [ ] Password: `password123`
- [ ] Copiar el UUID generado
- [ ] Ejecutar INSERT en SQL Editor con ese UUID
- [ ] Probar login en http://localhost:3002/#/login

---

## 🎯 ¿Qué sigue después?

1. Migrar el servicio de Grupos de mock data a Supabase
2. Migrar el servicio de Tareas
3. Migrar el servicio de Exámenes
4. Ver todo funcionar en tiempo real! 🚀

---

**Avísame cuando hayas creado el usuario y puedas hacer login!** 🔐
