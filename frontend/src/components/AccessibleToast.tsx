import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

/**
 * Enhanced Toaster component with improved accessibility attributes
 */
export function Toaster(props) {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: "toast-with-accessibility",
        role: "status", // ARIA role for screen readers
        ariaLive: "assertive", // Screen readers announce immediately
      }}
      {...props}
    />
  );
}

/**
 * Enhanced toast functions with additional accessibility features
 */
export const toast = {
  ...sonnerToast,
  success: (message, options = {}) => {
    return sonnerToast.success(message, {
      ...options,
      role: "status",
      ariaLive: "assertive",
    });
  },
  error: (message, options = {}) => {
    return sonnerToast.error(message, {
      ...options,
      role: "alert", // Alert role for errors
      ariaLive: "assertive",
    });
  },
  info: (message, options = {}) => {
    return sonnerToast.info(message, {
      ...options,
      role: "status",
      ariaLive: "polite", // Less urgent announcements
    });
  },
  warning: (message, options = {}) => {
    return sonnerToast.warning(message, {
      ...options,
      role: "alert",
      ariaLive: "assertive",
    });
  },
};
