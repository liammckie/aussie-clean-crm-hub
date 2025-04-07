
import React from 'react';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  important?: boolean;
}

const defaultOptions: ToastOptions = {
  duration: 5000,
  position: 'top-right',
  important: true
};

/**
 * Enhanced toast notification system with logging
 */
export const enhancedToast = {
  success: (message: string, options?: ToastOptions) => {
    AppLogger.info(LogCategory.UI, `Success Toast: ${message}`);
    return toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    AppLogger.error(LogCategory.UI, `Error Toast: ${message}`);
    return toast.error(message, { ...defaultOptions, ...options, duration: 7000 });
  },
  info: (message: string, options?: ToastOptions) => {
    AppLogger.info(LogCategory.UI, `Info Toast: ${message}`);
    return toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    AppLogger.warn(LogCategory.UI, `Warning Toast: ${message}`);
    return toast.warning(message, { ...defaultOptions, ...options });
  }
};
