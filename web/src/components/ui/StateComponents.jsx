export default function Spinner() {
    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );
}

export function SkeletonLoader({ count = 3 }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-20 bg-neutral-200 rounded-lg animate-pulse"></div>
            ))}
        </div>
    );
}

export function EmptyState({ title, description, action }) {
    return (
        <div className="text-center py-12">
            <div className="text-neutral-400 text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">{title}</h3>
            <p className="text-neutral-500 mb-4">{description}</p>
            {action && action}
        </div>
    );
}

export function ErrorState({ title, description, onRetry }) {
    return (
        <div className="text-center py-12">
            <div className="text-danger text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">{title}</h3>
            <p className="text-neutral-500 mb-4">{description}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Retry
                </button>
            )}
        </div>
    );
}
