import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { StudyTimerProvider } from './contexts/StudyTimerContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/app/queryClient';


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <StudyTimerProvider>
            <ToastProvider>
              <ThemeProvider>
                <SidebarProvider>
                  <App />
                </SidebarProvider>
              </ThemeProvider>
            </ToastProvider>
          </StudyTimerProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);