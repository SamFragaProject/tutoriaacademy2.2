import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';

interface ToastMessage {
  id: number;
  content: ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (content: ReactNode) => void;
  removeToast: (id: number) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((content: ReactNode, type?: 'success' | 'error' | 'warning' | 'info') => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, content, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 8000); // Auto-remove after 8 seconds
  }, [removeToast]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    addToast(message, type);
  }, [addToast]);

  const value = { toasts, addToast, removeToast, showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};