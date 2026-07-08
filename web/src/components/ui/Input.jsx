export default function Input({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    required = false,
    disabled = false,
    error = '',
    label = '',
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {label}
                    {required && <span className="text-danger ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors disabled:bg-neutral-100 disabled:cursor-not-allowed ${error ? 'border-danger' : ''
                    } ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
}
