import { forwardRef } from 'react';
const Input = forwardRef(({ label, error, className = '', id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (<div className="flex flex-col gap-1">
      {label && (<label htmlFor={inputId} className="font-label-md text-label-md font-bold text-on-surface-variant">
          {label}
        </label>)}
      <input id={inputId} ref={ref} className={`rounded-lg border px-space-sm py-space-sm bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${error ? 'border-error' : 'border-outline-variant'} ${className}`} {...rest}/>
      {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
    </div>);
});
Input.displayName = 'Input';
export default Input;
