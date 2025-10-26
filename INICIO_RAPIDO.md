#  INICIO RÁPIDO - 5 Minutos

##  TU MISIÓN

Configurar Supabase para que TutoriA Academy tenga base de datos real.

---

##  PASO A PASO (Copy/Paste)

### 1. Crear Proyecto Supabase
```
1. Abre: https://supabase.com
2. Login con GitHub
3. Click "New Project"
4. Nombre: tutoria-academy
5. Password: [COPIA Y GUARDA EN NOTEPAD]
6. Region: South America (São Paulo)
7. Click "Create Project"
8.  Espera 2 minutos
```

### 2. Ejecutar SQL
```
1. Sidebar izquierdo  "SQL Editor"
2. Click "New Query"
3. Abre tu archivo: supabase_schema_simple.sql
4. CTRL+A (seleccionar todo)  CTRL+C (copiar)
5. Pegar en el editor de Supabase
6. Click "Run" (esquina inferior derecha)
7. Debe decir: "Success. No rows returned" 
```

### 3. Obtener Credenciales
```
1. Sidebar  "Settings"  "API"
2. Copia estos 2 valores:

   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

3. Pégalos en Notepad temporalmente
```

### 4. Crear .env.local
```
1. Abre VS Code
2. En la raíz del proyecto, crea archivo: .env.local
3. Pega esto:

VITE_SUPABASE_URL=TU_URL_AQUI
VITE_SUPABASE_ANON_KEY=TU_KEY_AQUI
VITE_GEMINI_API_KEY=AIzaSy... (tu key existente)

4. Reemplaza TU_URL_AQUI y TU_KEY_AQUI con lo que copiaste
5. CTRL+S para guardar
```

### 5. Instalar y Probar
```powershell
# En PowerShell, dentro de tu proyecto:

npm install @supabase/supabase-js

# Espera que termine...

npm run dev

# Abre http://localhost:5173
# Abre la consola (F12)
# Debes ver: " Supabase connected successfully"
```

---

##  CHECKLIST FINAL

- [ ] Proyecto Supabase creado 
- [ ] SQL ejecutado sin errores 
- [ ] .env.local creado con 3 variables 
- [ ] npm install ejecutado 
- [ ] Servidor corriendo 
- [ ] Consola muestra "connected" 

---

##  SI TODO SALIÓ BIEN

Dime: **"Supabase listo"** y yo creo el panel admin completo.

---

##  SI ALGO FALLÓ

Dime exactamente qué error viste y te ayudo a solucionarlo.

---

##  DOCS COMPLETAS

- `GUIA_SETUP_SUPABASE.md`  Guía detallada
- `PANEL_ADMIN_SPECS.md`  Qué vamos a construir
- `RESUMEN_SETUP.md`  Plan completo

