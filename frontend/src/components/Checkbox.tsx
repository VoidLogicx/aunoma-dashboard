import * as React from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
}

export function Checkbox({
  label,
  helperText,
  className,
  id,
  checked,
  disabled,
  onChange,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${checkboxId}-helper` : undefined;
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className={`
            h-4 w-4 rounded border-gray-300 text-aunoma-red 
            focus:ring-aunoma-red focus:ring-offset-0 focus:ring-2
            transition-colors cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className || ""}
          `}
          aria-describedby={helperId}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label 
          htmlFor={checkboxId} 
          className={`font-medium text-aunoma-gray-dark ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {label}
        </label>
        {helperText && (
          <p className="text-aunoma-gray mt-0.5" id={helperId}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
