import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  { className, type, label, error, helperText, id, required, ...props }, ref
) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-aunoma-gray-dark mb-1"
        >
          {label}{required && <span className="text-aunoma-red ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        className={`
          appearance-none block w-full px-3 py-2 border 
          ${error ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} 
          rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-aunoma-red focus:border-aunoma-red
          text-aunoma-gray transition-colors 
          ${className || ""}
        `}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={`${errorId ? errorId : ""} ${helperId ? helperId : ""}`}
        aria-required={required ? "true" : undefined}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" id={errorId} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-aunoma-gray" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
