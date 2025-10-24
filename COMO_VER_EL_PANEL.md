# 🎯 GUÍA RÁPIDA - Ver el Panel de Administración

## 📍 **CÓMO ACCEDER:**

### **Opción 1: Desde el navegador en VS Code**
Ya se abrió automáticamente en: `http://localhost:5173`

### **Opción 2: Desde tu navegador normal**
Abre Chrome/Edge y ve a: `http://localhost:5173`

---

## 🔐 **PASO A PASO:**

### **1. Iniciar Sesión**
En la página de login, usa las credenciales de administrador:

```
Email: admin@tutoria.com
Contraseña: admin123
```

(O las credenciales que tengas configuradas para admin)

---

### **2. Ir al Panel de Administración**

Una vez logueado, navega a:

#### **Dashboard Principal:**
```
http://localhost:5173/#/admin/dashboard
```

#### **Gestión de Usuarios (LO NUEVO):**
```
http://localhost:5173/#/admin/usuarios
```

---

## 🎨 **LO QUE VERÁS:**

### **En `/admin/usuarios`:**

1. **Tabla de usuarios** con:
   - ✅ Búsqueda en tiempo real
   - ✅ Filtros por rol/estado
   - ✅ Checkboxes para selección múltiple
   - ✅ Menú de acciones (⋮) por usuario
   - ✅ Paginación

2. **Botones de acción:**
   - 🟦 **"Crear Usuario"** (azul) - Abre modal de creación
   - ⬜ **"Importar CSV"** (blanco) - Abre modal de carga masiva

3. **Acciones individuales** (menú ⋮):
   - Editar
   - Resetear contraseña
   - Activar/Desactivar
   - Eliminar

4. **Acciones masivas** (cuando seleccionas usuarios):
   - Activar múltiples
   - Desactivar múltiples
   - Exportar a CSV
   - Eliminar en lote

---

## 🧪 **PRUEBAS RECOMENDADAS:**

### **Test 1: Búsqueda**
1. Ve a `/admin/usuarios`
2. Escribe en el buscador: "Ana"
3. Deberías ver resultados filtrados

### **Test 2: Filtros**
1. Haz clic en "Filtros"
2. Selecciona "Rol: Estudiantes"
3. La tabla se actualiza automáticamente

### **Test 3: Importar CSV**
1. Haz clic en "Importar CSV"
2. Haz clic en "Descargar Plantilla CSV"
3. Se descarga `plantilla_usuarios.csv`
4. Abre el archivo y agrega algunos usuarios
5. Sube el archivo
6. Verás el preview y validación

### **Test 4: Crear Usuario**
1. Haz clic en "Crear Usuario"
2. El modal se abrirá (nota: el form completo lo implementaremos en el siguiente paso)

### **Test 5: Acciones**
1. Haz clic en el menú (⋮) de cualquier usuario
2. Prueba "Resetear contraseña"
3. Verás un toast con la nueva contraseña

---

## 🎥 **NAVEGACIÓN COMPLETA:**

### **Panel Principal:**
```
http://localhost:5173/#/admin/dashboard
```
- Métricas generales
- Usuarios activos
- Escuelas activas
- MRR estimado

### **Usuarios:**
```
http://localhost:5173/#/admin/usuarios
```
- ⭐ **NUEVO: Sistema completo de gestión**
- Lista, búsqueda, filtros
- CRUD completo
- Carga masiva CSV

### **Documentos:**
```
http://localhost:5173/#/admin/documentos
```
- Gestión de documentos de IA

### **Tutores:**
```
http://localhost:5173/#/admin/tutores
```
- Configuración de tutores IA

### **Métricas:**
```
http://localhost:5173/#/admin/metricas
```
- Análisis detallado

### **Emails:**
```
http://localhost:5173/#/admin/emails
```
- Plantillas de correo

### **APIs:**
```
http://localhost:5173/#/admin/apis
```
- Configuración de claves

---

## 📱 **RESPONSIVE:**

El panel funciona en:
- ✅ Desktop (óptimo)
- ✅ Tablet (adaptado)
- ✅ Mobile (responsive)

---

## 🐛 **SI NO VES ALGO:**

1. **Verifica que estés logueado como admin**
2. **Refresca la página** (F5)
3. **Limpia caché** (Ctrl + Shift + R)
4. **Verifica la consola** del navegador (F12)

---

## 💡 **TIPS:**

### **Para ver usuarios de prueba:**
La app ya tiene algunos usuarios mock:
- `user-001`: Estudiante
- `user-002`: Carlos Gomez
- `user-003`: Ana Sofia R.
- `user-004`: Luis Garcia

### **Para probar filtros:**
- Filtra por "student" para ver solo estudiantes
- Filtra por "admin" para ver administradores

### **Para probar búsqueda:**
- Busca por nombre: "Ana"
- Busca por email: "carlos"

### **Para probar CSV:**
1. Descarga la plantilla
2. Agrega 5-10 usuarios
3. Súbela
4. Observa la validación automática
5. Confirma la importación

---

## 🎯 **SIGUIENTE PASO:**

Una vez que veas todo funcionando, continuaremos con:
- ✅ Modals de crear/editar usuario (forms completos)
- ✅ Gestión de escuelas
- ✅ Sistema multi-tenant

---

## 📞 **¿NECESITAS AYUDA?**

Si algo no funciona:
1. Copia el error de la consola (F12)
2. Dime qué intentabas hacer
3. Te ayudo a solucionarlo

---

**¡EXPLORA Y PRUEBA TODO!** 🚀

Todo está funcionando en tiempo real con hot-reload, así que cualquier cambio se verá instantáneamente.
