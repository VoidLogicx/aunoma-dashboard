import * as React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((
  { className, label, error, helperText, id, required, ...props }, ref
) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-aunoma-gray-dark mb-1"
        >
          {label}{required && <span className="text-aunoma-red ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          appearance-none block w-full px-3 py-2 border 
          ${error ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} 
          rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-aunoma-red focus:border-aunoma-red
          text-aunoma-gray transition-colors min-h-[100px]
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

TextArea.displayName = "TextArea";

export { TextArea };
