import { toast } from 'sonner';

/**
 * Standardized error handling for network requests
 * @param error - The error object
 * @param customMessage - Optional custom message to display
 * @returns The formatted error message
 */
export const handleNetworkError = (error: any, customMessage?: string): string => {
  console.error('Network error:', error);
  
  // Default error message
  let errorMessage = customMessage || 'Wystąpił błąd podczas komunikacji z serwerem. Spróbuj ponownie.';
  
  // Check for specific error types
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    errorMessage = 'Nie można połączyć się z serwerem. Sprawdź połączenie internetowe.';
  } else if (error.status === 401) {
    errorMessage = 'Sesja wygasła. Zaloguj się ponownie.';
  } else if (error.status === 403) {
    errorMessage = 'Brak uprawnień do wykonania tej operacji.';
  } else if (error.status === 404) {
    errorMessage = 'Żądany zasób nie został znaleziony.';
  } else if (error.status >= 500) {
    errorMessage = 'Wystąpił błąd po stronie serwera. Spróbuj ponownie później.';
  }

  // Show toast notification
  toast.error(errorMessage);
  
  return errorMessage;
};

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Boolean indicating if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Hasło jest wymagane' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Hasło musi mieć co najmniej 6 znaków' };
  }
  
  return { isValid: true };
};

/**
 * Validate input field
 * @param value - Field value
 * @param fieldName - Name of the field for error message
 * @param required - Whether the field is required
 * @param minLength - Minimum length (optional)
 * @param maxLength - Maximum length (optional)
 * @returns Validation result object
 */
export const validateField = (
  value: string,
  fieldName: string,
  required: boolean = true,
  minLength?: number,
  maxLength?: number
): { isValid: boolean; message?: string } => {
  if (required && !value.trim()) {
    return { isValid: false, message: `Pole ${fieldName} jest wymagane` };
  }
  
  if (minLength && value.length < minLength) {
    return { isValid: false, message: `Pole ${fieldName} musi mieć co najmniej ${minLength} znaków` };
  }
  
  if (maxLength && value.length > maxLength) {
    return { isValid: false, message: `Pole ${fieldName} może mieć maksymalnie ${maxLength} znaków` };
  }
  
  return { isValid: true };
};
