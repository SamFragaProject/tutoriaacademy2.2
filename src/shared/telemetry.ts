/**
 * A simple, telemetry-agnostic tracker.
 * In a real app, this would send data to a telemetry service.
 */
export function track(event: string, payload: Record<string, any> = {}) {
  console.log(`[TELEMETRY] Event: ${event}`, payload);
}
