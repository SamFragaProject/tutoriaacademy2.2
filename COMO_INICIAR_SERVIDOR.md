#  GUÍA RÁPIDA - INICIAR SERVIDOR

##  Inicio Rápido (Copia y pega esto)

```powershell
# Paso 1: Limpiar procesos
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Paso 2: Esperar 2 segundos
Start-Sleep -Seconds 2

# Paso 3: Iniciar servidor
npm run dev
```

**Espera 10 segundos** y luego abre: **http://localhost:3002**

---

##  Si Hay Problemas

### Problema: "ERR_CONNECTION_REFUSED"
**Solución:**
1. Espera 10-15 segundos después de ejecutar npm run dev
2. Refresca la página (F5)
3. Si persiste, ejecuta los pasos de limpieza de nuevo

### Problema: "Port already in use"
**Solución:**
```powershell
# Matar todos los procesos Node
taskkill /F /IM node.exe

# Esperar y reintentar
Start-Sleep -Seconds 3
npm run dev
```

### Problema: Otro proyecto usa el mismo puerto
**Solución:**
- Cierra todos los terminales/VS Code del otro proyecto
- Ejecuta la limpieza de procesos
- Reinicia el servidor

---

##  URLs Importantes

- **Aplicación Principal:** http://localhost:3002
- **Login:** http://localhost:3002/#/login
- **Dashboard Profesor:** http://localhost:3002/#/docente/dashboard
- **Exámenes (Nuevo):** http://localhost:3002/#/docente/examenes

---

##  Usuarios de Prueba

**Profesor:**
- Usuario: Juan Martínez
- Rol: teacher

**Estudiante:**
- Usuario: Carlos López
- Rol: student

---

##  IMPORTANTE

- **Siempre** espera 10-15 segundos después de npm run dev
- **Siempre** cierra procesos Node antes de iniciar
- **Nunca** cierres la terminal donde corre npm run dev
- Si cambias código, Vite recarga automáticamente

---

##  Solución de Emergencia

Si nada funciona:

```powershell
# 1. Matar todo
taskkill /F /IM node.exe
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Limpiar caché
npm cache clean --force

# 3. Reinstalar
rm -r node_modules
npm install

# 4. Iniciar
npm run dev
```

---

**Última actualización:** 8 de Octubre, 2025
