# 📚 **GUÍA SÚPER SIMPLE - TutoriA Academy**

## 🎯 **TODO LO QUE NECESITAS HACER (Paso a Paso)**

---

## ✅ **PASO 1: Configurar Gemini API (5 minutos)**

### **¿Qué es Gemini?**
Es la IA de Google que responde preguntas de los estudiantes en el "Asistente".

### **Cómo obtener tu API Key:**

1. Ve a: https://aistudio.google.com/app/apikey
2. Inicia sesión con tu Gmail
3. Clic en "**Create API Key**"
4. Copia la clave (algo como: `AIzaSyXXXXXXXXXXXXXXXXX`)

### **Dónde ponerla:**

1. Abre el archivo `.env` en tu proyecto
2. Reemplaza `tu_api_key_aqui` con tu clave real:

```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX  ← Pega tu clave aquí
```

3. **Guarda el archivo**
4. **Reinicia el servidor** (Ctrl+C y luego `npm run dev`)

### **¿Cómo sé que funciona?**

1. Abre tu app: http://localhost:3000/
2. Inicia sesión como estudiante
3. Haz clic en el **bot flotante** (esquina inferior derecha)
4. Escribe: "¿Qué es una ecuación cuadrática?"
5. Si responde → ✅ ¡Funciona!
6. Si da error → ❌ Verifica tu API key

---

## ✅ **PASO 2: Crear proyecto Firebase (10 minutos)**

### **¿Qué es Firebase?**
Es donde se guardarán TODOS los datos (usuarios, puntuaciones, progreso).

### **Paso 2.1: Crear el proyecto**

1. Ve a: https://console.firebase.google.com/
2. Clic en "**Agregar proyecto**"
3. Nombre del proyecto: `tutoria-academy`
4. **Desactiva** Google Analytics (no lo necesitas)
5. Clic en "**Crear proyecto**"
6. Espera 30 segundos...

### **Paso 2.2: Obtener las credenciales**

1. Clic en el **ícono de engranaje** ⚙️ (arriba izquierda)
2. "**Configuración del proyecto**"
3. Scroll hacia abajo hasta "**Tus aplicaciones**"
4. Clic en el ícono **</>** (Web)
5. Nombre de la app: `tutoria-web`
6. **NO marques** Firebase Hosting
7. Clic en "**Registrar app**"

Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
  authDomain: "tutoria-academy.firebaseapp.com",
  projectId: "tutoria-academy",
  storageBucket: "tutoria-academy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

8. **COPIA TODO ESO** 📋

### **Paso 2.3: Poner las credenciales en tu código**

1. Abre el archivo `.env`
2. Pega tus credenciales así:

```env
# FIREBASE
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tutoria-academy.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tutoria-academy
VITE_FIREBASE_STORAGE_BUCKET=tutoria-academy.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

3. **Guarda el archivo**

### **Paso 2.4: Habilitar Authentication**

1. En Firebase Console, menú izquierdo: "**Authentication**"
2. Clic en "**Comenzar**"
3. Selecciona "**Correo electrónico/contraseña**"
4. **Activa el primer switch** (Email/Password)
5. Clic en "**Guardar**"

### **Paso 2.5: Habilitar Firestore**

1. En Firebase Console, menú izquierdo: "**Firestore Database**"
2. Clic en "**Crear base de datos**"
3. Selecciona "**Iniciar en modo de prueba**"
4. Ubicación: Elige `us-central` (o el más cercano a ti)
5. Clic en "**Habilitar**"

---

## ✅ **PASO 3: Yo hago TODO el código**

Una vez tengas:
- ✅ Gemini API Key en `.env`
- ✅ Firebase credenciales en `.env`

**Dime: "Listo, tengo todo configurado"**

Y yo haré:
1. ✅ Migrar autenticación a Firebase
2. ✅ Migrar puntuaciones del gimnasio a Firebase
3. ✅ Migrar XP, logros y racha a Firebase
4. ✅ Migrar progreso de estudiantes a Firebase
5. ✅ Configurar reglas de seguridad
6. ✅ Probar que todo funciona

---

## 🔒 **SEGURIDAD - Explicación SIMPLE**

### **¿Qué son las "reglas de seguridad"?**

Imagina tu base de datos como un edificio:

#### **Sin reglas (MALO ❌):**
```
🏢 Edificio Firebase
├── Puerta: Abierta para TODOS
├── Juan puede ver las puntuaciones de María
├── María puede cambiar su XP a 999,999
└── Pedro puede borrar a otros estudiantes
```

#### **Con reglas (BUENO ✅):**
```
🏢 Edificio Firebase
├── Puerta: Solo con llave (autenticación)
├── Juan solo ve SUS datos
├── María NO puede modificar su XP manualmente
└── Pedro NO puede borrar a nadie
```

### **¿Dónde se ponen las reglas?**

En Firebase Console → Firestore Database → Rules

### **¿Quién las escribe?**

**YO las escribo por ti** 😊

Tú solo copias y pegas cuando te diga.

### **Ejemplo de regla simple:**

```javascript
// Solo puedes leer/escribir TUS propios datos
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

**Significa:**
- Solo puedes acceder a TU perfil (no de otros)
- Necesitas estar autenticado (haber iniciado sesión)

---

## 📊 **CHECKLIST ANTES DE SUBIR A PRODUCCIÓN**

### **1. Funcionalidades Completas:**
- ✅ 8 juegos del gimnasio funcionando
- ⏳ Firebase integrado
- ⏳ Gemini respondiendo preguntas
- ⏳ Todos los datos se guardan

### **2. Seguridad:**
- ⏳ Reglas de Firestore configuradas
- ✅ API keys en .env (no en el código)
- ✅ .gitignore protege .env

### **3. Testing:**
- ⏳ Crear cuenta de estudiante
- ⏳ Jugar todos los juegos
- ⏳ Verificar que puntuaciones se guardan
- ⏳ Hacer logout y login → datos persisten
- ⏳ Preguntar al asistente IA

### **4. Performance:**
- ⏳ App carga en menos de 3 segundos
- ⏳ Juegos corren suaves (60fps)
- ⏳ Imágenes optimizadas

### **5. Deploy:**
- ⏳ Compilar: `npm run build`
- ⏳ Subir carpeta `dist/` a Hostinger
- ⏳ Configurar dominio
- ⏳ Verificar que funciona en producción

---

## 🎯 **QUÉ FALTA POR HACER**

Según el análisis que hice, para tener el proyecto 100% completo faltan:

### **CRÍTICO (antes de subir):**
1. ⏳ Integrar Firebase (en proceso)
2. ⏳ Configurar Gemini API (en proceso)

### **IMPORTANTE (para mejorar):**
3. ⏳ Implementar 4 juegos más (de 8 a 12 juegos)
4. ⏳ Sistema de achievements visual
5. ⏳ Rankings entre estudiantes

### **OPCIONAL (para después):**
6. ⏳ Modo offline completo
7. ⏳ Notificaciones push
8. ⏳ App móvil (React Native)

---

## 📞 **SI ALGO NO FUNCIONA**

### **Problema: Gemini no responde**
✅ Verifica que tu API key esté en `.env`
✅ Reinicia el servidor (Ctrl+C y `npm run dev`)
✅ Verifica que NO tenga comillas extras

### **Problema: Firebase da error**
✅ Verifica que TODAS las credenciales estén en `.env`
✅ Verifica que habilitaste Authentication y Firestore
✅ Mira la consola del navegador (F12) para ver el error exacto

### **Problema: No compila**
✅ Ejecuta `npm install`
✅ Borra `node_modules` y ejecuta `npm install` de nuevo
✅ Verifica que no haya errores de sintaxis

---

## 🚀 **SIGUIENTE PASO**

1. **Obtén tu Gemini API Key** (5 minutos)
2. **Crea tu proyecto Firebase** (10 minutos)
3. **Pega ambos en `.env`**
4. **Dime cuando esté listo** 

**Yo haré todo el resto del código** 🤖

---

## 💡 **CONSEJO FINAL**

**NO te estreses si algo no funciona a la primera**

La programación es así: prueba, error, arregla, prueba otra vez.

**YO estoy aquí para ayudarte** en cada paso 😊

**¿Tienes alguna duda antes de empezar?**
