# Manual del Usuario — Rol Profesor (TutoriA Academy)

Documento funcional para la operación diaria del rol Profesor en un despliegue real (Supabase + Vercel). No usa datos de demostración. Se centra en flujos reales, configuraciones y criterios de aceptación.

- Ámbito: Profesor
- Plataforma: SPA desplegada en Vercel; backend gestionado con Supabase (Auth, DB, Storage, RLS)
- Requisitos previos: Alta de la escuela y usuarios por Dirección/Admin; asignación de cursos y grupos
- Última actualización: 2025-10-24

## Tabla de Contenido

1. [Propósito del rol Profesor](#1-propósito-del-rol-profesor)
2. [Acceso e Identidad (Auth & Seguridad)](#2-acceso-e-identidad-auth--seguridad)
3. [Perfil del Profesor](#3-perfil-del-profesor)
4. [Estructura Académica: Cursos, Grupos y Unidades](#4-estructura-académica-cursos-grupos-y-unidades)
5. [Banco de Contenidos y Reactivos](#5-banco-de-contenidos-y-reactivos)
6. [Exámenes (Creación → Publicación → Aplicación → Calificación)](#6-exámenes-creación--publicación--aplicación--calificación)
7. [Gimnasio Cognitivo (Práctica Adaptativa)](#7-gimnasio-cognitivo-práctica-adaptativa)
8. [Tareas y Cuestionarios Formativos](#8-tareas-y-cuestionarios-formativos)
9. [Analítica y Libro de Calificaciones](#9-analítica-y-libro-de-calificaciones)
10. [Comunicación](#10-comunicación)
11. [Gamificación (Vista Profesor)](#11-gamificación-vista-profesor)
12. [Biblioteca de Recursos](#12-biblioteca-de-recursos)
13. [Integración Técnica (Operativo para el Profesor)](#13-integración-técnica-operativo-para-el-profesor)
14. [Flujo de Trabajo Recomendado](#14-flujo-de-trabajo-recomendado-profesor)
15. [Casos Borde y Políticas](#15-casos-borde-y-políticas)
16. [Bitácora (Auditoría)](#16-bitácora-auditoría)
17. [Glosario Breve](#17-glosario-breve)
18. [Checklist Rápido por Función](#18-checklist-rápido-por-función)
19. [Métricas Clave para el Profesor](#19-métricas-clave-para-el-profesor)
20. [Plantillas/Componentes visibles para el Profesor](#20-plantillascomponentes-visibles-para-el-profesor)

---

## 1) Propósito del rol Profesor

- Crear, gestionar y mejorar experiencias de aprendizaje para grupos y cursos.
- Diseñar exámenes y gimnasios cognitivos (práctica adaptativa).
- Monitorear progreso, dominio y motivación del alumno con analítica accionable.
- Coordinar comunicación con alumnos y directivos.
- Mantener calidad académica e integridad de evaluaciones.

Dónde encontrarlo en la app:
- Sidebar: Dashboard, Cursos, Grupos, Banco, Exámenes, Calificaciones, Gimnasio, Tareas, Analítica, Comunicación, Biblioteca, Perfil.

## 2) Acceso e Identidad (Auth & Seguridad)

- Inicio de sesión: email + contraseña; SSO si su escuela lo habilitó.
- Roles y permisos: Profesor ve/edita solo sus cursos, grupos y evaluaciones.
- Verificación de institución: recursos asociados a su escuela/sede.
- Seguridad: cierre de sesión, rotación de tokens; 2FA si está habilitado.

Flujos:
- Iniciar sesión: introduzca credenciales → si el rol es profesor, la app redirige al Dashboard del profesor.
- Cerrar sesión: menú superior derecho → Cerrar sesión.
- Cambiar contraseña: Perfil → Seguridad → Cambiar contraseña.
- Activar 2FA (opcional): Perfil → Seguridad → 2FA.

Criterios de aceptación
- El profesor solo ve recursos de sus cursos/grupos.
- Cambiar contraseña y cerrar sesión funcionan sin errores.
- Bitácora registra acciones clave del profesor (creación/edición/publicación/calificación).

## 3) Perfil del Profesor

### 3.1 Datos del perfil
- Foto, nombre visible, materias, bio corta.
- Idioma preferido.
- Disponibilidad (horarios de atención).
- Vínculos a grupos/cursos asignados.

### 3.2 Preferencias
- Notificaciones: email, push, plataforma (trabajos, dudas, alertas de riesgo).
- Formato: KaTeX para fórmulas matemáticas en editores y previsualización.
- IA/Asistencias (si su escuela las activa): sugerencias de ítems, propuestas de retroalimentación, generación de variantes con control de dificultad.

Criterios de aceptación
- Editar foto/bio/notificaciones se refleja inmediatamente.
- Previsualización KaTeX opera en el editor del profesor.

## 4) Estructura Académica: Cursos, Grupos y Unidades

### 4.1 Cursos
- Crear curso: nombre, materia, nivel, periodo, objetivos.
- Estructurar unidades/módulos: temas, subtemas, competencias.
- Adjuntar recursos: PDF, video, enlaces y actividades (tarea, cuestionario, examen, práctica en gimnasio).

### 4.2 Grupos/Clases
- Asignar grupos al curso (ej. 3°A, 3°B).
- Listas de alumnos (provistas por Dirección/Admin).
- Calendario del grupo (sesiones, entregas, exámenes).

Criterios de aceptación
- Crear/editar curso y unidades sin pérdida de datos.
- Vistas por grupo con progreso y próximas fechas visibles.

## 5) Banco de Contenidos y Reactivos

### 5.1 Bancos
- Banco de preguntas por curso/unidad: opción múltiple, respuesta abierta, numérica, verdadero/falso, relación, ensayo.
- Metadatos por reactivo: tema, subtema, objetivo, dificultad (Fácil/Media/Difícil), tiempo estimado, etiquetas.
- Versionado: historial de cambios y autoría.
- Bloqueo anti-filtraciones: control de visibilidad (solo profesor/compartido con equipo docente).

### 5.2 Editor de Reactivos
- Enunciado con KaTeX y multimedia.
- Claves y explicación de respuesta.
- Distractores parametrizados (opción múltiple).
- Tolerancias en numéricos (rango o precisión).
- Rúbricas para abiertas/ensayo.
- Previsualización como verá el alumno.

Criterios de aceptación
- Todo reactivo tiene clave o rúbrica.
- Reactivos clasificados al menos por tema y dificultad.
- Previsualización coincide con la entrega real.

## 6) Exámenes (Creación → Publicación → Aplicación → Calificación)

### 6.1 Configuración del Examen
- Nuevo examen: título, curso/unidad, objetivos y competencias.
- Selección de reactivos: manual (desde banco) o automática (filtros: temas, dificultad, número de preguntas, tiempo total).
- Barajado de orden y/o de opciones.
- Parámetros: tiempo límite (min), intentos (1..n), ventana de aplicación (inicio/fin y zona horaria).
- Proctoring ligero (si está activado): bloqueo/navegación, señales básicas.
- Mostrar/ocultar retro al terminar.
- Ponderaciones por sección y curva/norma (opcional, control institucional).

### 6.2 Publicación y Acceso
- Asignar a grupos o alumnos específicos.
- Enviar notificaciones de disponibilidad.
- Comprobación de dispositivo previa.

### 6.3 Aplicación (Vista Alumno)
- Temporizador visible, guardado automático, indicadores de preguntas pendientes.
- Accesibilidad: navegación por teclado y lector.

### 6.4 Calificación
- Automática: opción múltiple, V/F, numéricas con tolerancia, relación exacta.
- Semiautomática/Manual: abiertas/ensayo con rúbrica y comentarios.
- Interfaz de rúbrica: criterios, niveles, notas rápidas, feedback.
- Detección básica de anomalías (proctoring): cambios de ventana, inactividad, patrones improbables.

### 6.5 Cierre y Retro
- Publicar calificaciones por grupo/alumno.
- Control de revelado: score; score+claves; score+explicaciones; o nada (hasta fecha).
- Exportaciones: CSV/PDF y envío al libro de calificaciones.

Criterios de aceptación
- Un examen puede crearse con filtros y barajado.
- Calificación automática corre sin intervención en reactivos cerrados.
- Rúbricas permiten calificar por criterios y dejar feedback.
- Reporte de resultados por pregunta y por alumno disponible.

## 7) Gimnasio Cognitivo (Práctica Adaptativa)

### 7.1 Objetivo
- Entrenamiento personalizado con sesiones cortas que ajustan dificultad según desempeño; repaso espaciado y maestría por objetivo.

### 7.2 Configuración por el Profesor
- Seleccionar temas/competencias objetivo.
- Definir rango de dificultad y duración (p. ej., 10–15 min).
- Permitir reintentos con variaciones (versionado).
- Bonos de gamificación por racha y precisión.

### 7.3 Funcionamiento
- Algoritmo propone siguiente ítem en base a aciertos, tiempo, dificultad y olvido estimado.
- Feedback inmediato y explicación.
- Reincorpora ítems fallados hasta dominio (umbral configurable).

### 7.4 Seguimiento
- Panel: mapa de calor de dominio, tasa de aciertos, tiempo invertido, alumnos en riesgo.
- Sugerencias para tareas o mini-exámenes de consolidación.

Criterios de aceptación
- Sesiones registran aciertos/errores/tiempo.
- Informe de dominio por alumno y por grupo.
- El profesor puede reasignar objetivos del gimnasio en cualquier momento.

## 8) Tareas y Cuestionarios Formativos

- Crear tareas con fecha límite, rúbrica y adjuntos.
- Crear cuestionarios formativos (sin calificación sumativa) con retro inmediata.
- Opción de reentrega y comentarios encadenados.

Criterios de aceptación
- Tareas con rúbrica exportan calificación y feedback.
- Cuestionarios formativos no afectan promedio, pero alimentan analítica.

## 9) Analítica y Libro de Calificaciones

### 9.1 Vistas Clave
- Por curso/grupo: promedio, dispersión, dominio por tema, alertas de riesgo.
- Por examen: p‑value (dificultad empírica), discriminación básica, tiempo promedio.
- Por alumno: progreso, rachas, asistencia, entregas, áreas débiles/fuertes.

### 9.2 Acciones desde Analítica
- Recomendar prácticas específicas; autoasignar gimnasio por tema débil.
- Sugerir refuerzos o asesorías.
- Exportar reportes para Dirección/Padres (si está habilitado).

Criterios de aceptación
- KPIs visibles sin latencia notable.
- Descarga CSV/PDF disponible.
- Enlaces directos a reasignación de práctica.

## 10) Comunicación

- Mensajes a grupos o alumnos (avisos, recordatorios).
- Comentarios en tareas/exámenes.
- Plantillas rápidas: recordatorio de examen, retro de unidad, aviso de riesgo.

Criterios de aceptación
- Historial por conversación accesible.
- Control para desactivar respuestas en avisos unidireccionales.

## 11) Gamificación (Vista Profesor)

- Configurar reglas de puntos/XP por acciones.
- Logros por dominio de temas, constancia, mejora.
- Rankings por grupo/curso (anónimos o con nombres, según política).
- Control para ocultar/mostrar ranking.

Criterios de aceptación
- Configuración de XP por curso/unidad.
- Logros asignables y visibles para alumnos.

## 12) Biblioteca de Recursos

- Subir materiales (PDF, videos, enlaces) con metadatos: tema, nivel, duración.
- Compartir entre docentes del mismo curso (si el centro lo permite).

Criterios de aceptación
- Previsualización segura de archivos.
- Búsqueda por tema/etiquetas.

## 13) Integración Técnica (Operativo para el Profesor)

- No requiere programación por el profesor; describe el comportamiento esperado en la plataforma.

Supabase
- Auth: gestión de sesiones y roles.
- DB: cursos, grupos, matrículas, bancos, reactivos, exámenes, intentos, calificaciones, tareas, sesiones de gimnasio, logs.
- RLS: filas visibles solo para propietarios (profesores de ese curso) o roles con permiso.
- Storage: recursos (PDF, imágenes, multimedia) con políticas de lectura.

Front (Vercel)
- SPA con rutas protegidas por rol.
- Render KaTeX en editores y previsualizaciones.
- Componentes accesibles (WAI-ARIA) y responsivos.

Criterios de aceptación
- Los filtros de rol se cumplen en todas las vistas.
- Archivos de alumnos no son visibles entre cursos no relacionados.

## 14) Flujo de Trabajo Recomendado (Profesor)

1. Configurar curso: objetivos, unidades, calendario.
2. Alimentar banco: mínimo 10–15 reactivos por tema con dificultad escalonada.
3. Crear examen: filtros por temas y dificultad; fijar ventana y parámetros.
4. Publicar: asignar a grupos y notificar.
5. Supervisar: durante la aplicación, revisar alertas.
6. Calificar: automática + rúbricas; publicar resultados con retro.
7. Analizar: identificar cuellos de botella y re‑asignar gimnasio.
8. Comunicar: avisos y refuerzos; ajustar plan de unidad.

## 15) Casos Borde y Políticas

- Extensiones: permitir entregas fuera de tiempo con penalización configurable.
- Reintentos: limitar por alumno y escalonar dificultad.
- Desconexiones: continuidad de intento con guardado automático.
- Integridad: si se detectan anomalías, marcar intento para revisión manual.
- Accesibilidad: tiempo extra (x1.25/x1.5), lector, alto contraste.

## 16) Bitácora (Auditoría)

- Registra: creación/edición de reactivos, publicación de exámenes, cambios de parámetros, calificaciones editadas, comentarios publicados.

Criterios de aceptación
- Cada acción crítica queda con sello de tiempo y usuario.

## 17) Glosario Breve

- KaTeX: motor para renderizar fórmulas matemáticas.
- Banco de reactivos: repositorio estructurado de preguntas.
- Gimnasio cognitivo: práctica adaptativa con repaso espaciado.
- Rúbrica: criterios y niveles para evaluar respuestas abiertas.
- Proctoring ligero: señales básicas de integridad durante un examen.

## 18) Checklist Rápido por Función

Perfil
- Editar bio, foto, idioma, notificaciones.

Cursos/Grupos
- Crear curso, unidades, asignar grupos y calendario.

Banco
- Crear/editar reactivos con metadatos, clave/rúbrica, previsualizar.

Exámenes
- Generar por filtros, configurar, publicar, calificar (auto/rúbrica), reportar.

Gimnasio
- Objetivos por tema, sesiones adaptativas, reportes de dominio.

Analítica
- Vistas por curso, examen y alumno; exportables; acciones sugeridas.

Comunicación
- Mensajes a grupo/alumno; plantillas y registro.

Gamificación
- Configurar XP/logros; ranking opcional.

Biblioteca
- Subir y etiquetar recursos; compartir entre docentes permitidos.

Seguridad
- RLS activa; bitácora de acciones; manejo de accesos por rol.

## 19) Métricas Clave para el Profesor

- Tasa de finalización de tareas y exámenes.
- Dominios por tema (antes/después de gimnasio).
- Tiempo promedio por reactivo y por unidad.
- Mejora por cohorte y por alumno en riesgo.
- Uso de rachas y logros (engagement).

## 20) Plantillas/Componentes visibles para el Profesor

- Creador de exámenes (filtros por tema/dificultad, barajado, ventana).
- Calificador con rúbrica (sidebar de criterios, comentarios rápidos).
- Panel de dominio (mapa de calor, drill‑down por alumno).
- Gestor de banco (tabla + editor con KaTeX).
- Asignador de gimnasio (objetivos + duración + variación).
- Mensajería (selección por grupo/alumno, plantillas).
- Libro de calificaciones (columnas por evaluación, exportación).

---

Notas
- Sin datos demo: inicie sesión con sus credenciales reales.
- Si no ve cursos o grupos, contacte a Dirección/Admin para su asignación en Supabase.
- Para fórmulas: use $inline$ o bloques $$display$$ (KaTeX) en editores compatibles.
