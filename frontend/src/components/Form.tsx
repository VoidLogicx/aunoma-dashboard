import * as React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  success?: string;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>((
  { children, className, onSubmit, error, success, ...props }, ref
) => {
  const formId = `form-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${formId}-error` : undefined;
  const successId = success ? `${formId}-success` : undefined;
  
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-4 ${className || ''}`}
      aria-describedby={`${errorId ? errorId : ""} ${successId ? successId : ""}`}
      ref={ref}
      {...props}
    >
      {error && (
        <div 
          className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md" 
          id={errorId}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div 
          className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md" 
          id={successId}
          role="status"
          aria-live="polite"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </form>
  );
});

Form.displayName = "Form";

export { Form };
