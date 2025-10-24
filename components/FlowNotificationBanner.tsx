// components/FlowNotificationBanner.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import * as flowNotifications from '../services/flowNotifications';
import type { FlowNotification } from '../services/flowNotifications';

/**
 * Banner de notificaciones inteligentes basado en el flujo del usuario
 * Se muestra en la parte superior del dashboard
 */

interface FlowNotificationBannerProps {
  maxVisible?: number;
  className?: string;
}

const FlowNotificationBanner: React.FC<FlowNotificationBannerProps> = ({ 
  maxVisible = 2,
  className = '' 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<FlowNotification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Cargar notificaciones activas
    const activeNotifications = flowNotifications.getActiveNotifications(user.id, user.role);
    setNotifications(activeNotifications.slice(0, maxVisible));
  }, [user, maxVisible]);

  const handleDismiss = (notificationId: string) => {
    if (!user) return;
    flowNotifications.dismissNotification(user.id, notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleAction = (notification: FlowNotification) => {
    if (notification.actionRoute) {
      navigate(notification.actionRoute);
      if (notification.dismissible) {
        handleDismiss(notification.id);
      }
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              delay: index * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 25 
            }}
          >
            <NotificationCard
              notification={notification}
              onDismiss={handleDismiss}
              onAction={handleAction}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface NotificationCardProps {
  notification: FlowNotification;
  onDismiss: (id: string) => void;
  onAction: (notification: FlowNotification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onDismiss, 
  onAction 
}) => {
  // Estilos según el tipo de notificación
  const typeStyles = {
    info: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'bg-blue-500',
    },
    success: {
      bg: 'bg-green-500/10 dark:bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-700 dark:text-green-300',
      icon: 'bg-green-500',
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-300',
      icon: 'bg-amber-500',
    },
    action: {
      bg: 'bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-700 dark:text-purple-300',
      icon: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
  };

  const style = typeStyles[notification.type];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative overflow-hidden rounded-xl border-2 ${style.bg} ${style.border} backdrop-blur-sm`}
    >
      {/* Animated gradient background */}
      {notification.type === 'action' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        />
      )}

      <div className="relative p-4 flex items-start gap-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className={`flex-shrink-0 w-12 h-12 rounded-full ${style.icon} flex items-center justify-center text-2xl shadow-lg`}
        >
          {notification.icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-bold ${style.text} text-base`}>
              {notification.title}
            </h4>
            
            {/* Priority Badge */}
            {notification.priority === 'high' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
              >
                Urgente
              </motion.span>
            )}
          </div>

          <p className="text-sm text-text-secondary mb-3">
            {notification.message}
          </p>

          {/* Action Button */}
          {notification.actionLabel && (
            <motion.button
              onClick={() => onAction(notification)}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                notification.type === 'action'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : `bg-white/50 dark:bg-gray-800/50 ${style.text} hover:bg-white/80 dark:hover:bg-gray-800/80`
              }`}
            >
              <span>{notification.actionLabel}</span>
              <ChevronRight size={16} />
            </motion.button>
          )}
        </div>

        {/* Dismiss Button */}
        {notification.dismissible && (
          <motion.button
            onClick={() => onDismiss(notification.id)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Descartar notificación"
          >
            <X size={18} className="text-text-secondary" />
          </motion.button>
        )}
      </div>

      {/* Progress Bar for action type */}
      {notification.type === 'action' && (
        <motion.div
          className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </motion.div>
  );
};

export default FlowNotificationBanner;
