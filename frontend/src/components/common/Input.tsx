import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, helperText, className = '', ...rest }, ref) => {
    const inputClasses = `
      px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
      ${error ? 'border-red-500' : 'border-gray-300'}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label
            htmlFor={rest.id || rest.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...rest} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
