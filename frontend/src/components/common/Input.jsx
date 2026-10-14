import { forwardRef, useId } from 'react';

const Input = forwardRef(({ label, error, className = '', id, helperText, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? rest.name ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = [
      error ? errorId : null,
      helperText ? helperId : null,
      rest['aria-describedby'] || null
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="font-label-md text-label-md font-bold text-on-surface">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`rounded-lg border px-space-sm py-space-sm bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline-variant/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            error ? 'border-error ring-1 ring-error/50' : 'border-outline-variant hover:border-outline'
          } ${className}`}
          {...rest}
        />
        {helperText && !error && (
          <span id={helperId} className="font-body-sm text-[11px] text-on-surface-variant">
            {helperText}
          </span>
        )}
        {error && (
          <span id={errorId} role="alert" className="font-body-sm text-body-sm text-error font-medium flex items-center gap-1">
            {error}
          </span>
        )}
      </div>
    );
});
Input.displayName = 'Input';
export default Input;
