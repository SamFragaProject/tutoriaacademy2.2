const LOG_KEY = 'metrics:log';
const MAX_LOG_SIZE = 500; // Store last 500 events

interface MetricEvent {
  name: string;
  payload?: any;
  timestamp: string;
}

/**
 * Mock analytics tracking service.
 * In a real application, this would integrate with a service like Google Analytics, Mixpanel, etc.
 * Now it also logs events to localStorage for the admin dashboard to consume.
 */
export function track(name: string, payload?: any): void {
  console.log('[METRICS]', name, payload || '');
  
  if (typeof window === 'undefined') return;

  try {
    const newEvent: MetricEvent = {
      name,
      payload,
      timestamp: new Date().toISOString(),
    };
    
    const existingLog = localStorage.getItem(LOG_KEY);
    const log: MetricEvent[] = existingLog ? JSON.parse(existingLog) : [];
    
    log.unshift(newEvent); // Add to the front
    
    // Trim the log to prevent it from growing indefinitely
    if (log.length > MAX_LOG_SIZE) {
      log.length = MAX_LOG_SIZE;
    }
    
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch (error) {
    console.error('Failed to write to metrics log:', error);
  }
}

export function getEventLog(): MetricEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}