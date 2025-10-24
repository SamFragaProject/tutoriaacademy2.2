type EventCallback = (data: any) => void;

export const on = (eventName: string, callback: EventCallback): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {}; // No-op for server-side rendering
  }
  
  const handler = (event: Event) => {
    callback((event as CustomEvent).detail);
  };

  window.addEventListener(eventName, handler);

  // Return a cleanup function
  return () => {
    window.removeEventListener(eventName, handler);
  };
};

export const dispatch = (eventName: string, data: any): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const event = new CustomEvent(eventName, { detail: data });
  window.dispatchEvent(event);
};
