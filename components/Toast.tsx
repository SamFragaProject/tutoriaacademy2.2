import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

// Re-exporting useToast to be used from this module.
export { useToast } from '../contexts/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    // This div acts as a portal target for all toasts.
    // `pointer-events-none` allows clicks to pass through the container.
    <div 
      aria-live="assertive"
      className="fixed top-24 right-5 z-[9999] flex flex-col items-end gap-3 pointer-events-none"
    >
        <AnimatePresence>
            {toasts.map(toast => (
                // Each toast is a motion component with entry and exit animations.
                 <motion.div
                    key={toast.id}
                    layout // Ensures smooth reordering if toasts are removed from the middle.
                    className="pointer-events-auto" // Re-enable pointer events for the toast itself.
                    initial={{ opacity: 0, y: -20 }} // Starts transparent and slightly above (slide down effect).
                    animate={{ opacity: 1, y: 0 }}   // Fades in and slides down to its final position.
                    exit={{ opacity: 0, y: -20 }}    // Fades out and slides up on exit.
                    transition={{ type: 'spring', stiffness: 350, damping: 40 }}
                >
                    {toast.content}
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
  );
};