export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) {
    const baseClasses = 'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
        danger: 'bg-danger text-white hover:bg-red-600 focus:ring-danger',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
