# NFRs & SLOs — TutoriA Academy

## No Funcionales (NFR)
- Seguridad: JWT, refresh tokens, rotation, RBAC; auditoría de cambios críticos.
- Disponibilidad: Blue/Green o Rolling deploy, health checks, circuit breakers.
- Rendimiento: P95 < 300ms para GET; P95 < 800ms para POST críticos.
- Escalabilidad: horizontal en stateless services; colas para ingestión/indexación.
- Observabilidad: trazas (OpenTelemetry), logs estructurados, métricas (RED/USE).
- Costo: presupuestos y alertas para IA (token/call), límites por organización.
- Compatibilidad: versionado API, deprecations comunicadas con 90 días.
- Privacidad: PII en repos seguros; retención y derecho al olvido.

## SLOs (iniciales)
- Disponibilidad anual (API principal): 99.9%
- Latencia P95 (GET /exams, /items): ≤ 300ms
- Tasa de errores 5xx mensual: ≤ 0.5%
- Indexación documentos a disponible: ≤ 15 min P95
- Tiempo de entrega calificada (auto-grading): ≤ 10s P95

## Catálogo de Errores (resumen)
- AUTH_401: credenciales inválidas / token expirado.
- AUTH_403: rol/permiso insuficiente.
- VAL_422: validación fallida (detalles de campo).
- NOTF_404: recurso no encontrado.
- SRV_429: rate limit excedido.
- SRV_5xx: errores internos/transitorios.

## Rate Limits (sugeridos)
- /auth/login: 5/min por IP
- /items (search): 60/min por token
- /exams/*: 30/min por token
- /documents/upload: 10/min por org

## Idempotencia
- Cabecera `Idempotency-Key` para POST sensibles (crear examen, envío de email, ingestión).