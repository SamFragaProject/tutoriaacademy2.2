# API Docs — TutoriA Academy

Este paquete documenta la API propuesta para integrar backend real con los flujos B2B del proyecto.

## Convenciones
- Base URL: `/api`
- Autenticación: `Authorization: Bearer <JWT>` (RBAC por rol)
- Paginación: `?page=1&pageSize=20` (cabeceras `X-Total-Count` y `Link` opcional)
- Errores: JSON `{ code, message, details? }`. Códigos semánticos con catálogo.
- Idempotencia: `Idempotency-Key` en operaciones POST sensibles (crear examen, subir doc, enviar email).
- Versionado: encabezado `Accept: application/vnd.tutoria.v1+json` o prefijo `/v1`.

## Recursos
- Auth: login/refresh/logout
- Users/Roles: datos propios y de la escuela
- Groups/Students: grupos, alumnos, membresías
- Topics: catálogo de temas/subtemas
- Items (Banco): creación, búsqueda, edición
- Exams: creación, asignación, resultados
- Assignments & Submissions: entrega y calificación
- Documents: ingestión e indexación (RAG)

## OpenAPI
Consulta `docs/api/openapi.yaml` para el detalle completo (endpoints, parámetros, esquemas y ejemplos).