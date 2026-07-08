import { useI18n } from '../../hooks/useI18n';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, actions }) {
    const { t } = useI18n();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="px-6 py-4">
                    {children}
                </div>

                <div className="border-t border-neutral-200 px-6 py-4 flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                    {actions && actions.map((action, idx) => (
                        <Button
                            key={idx}
                            onClick={action.onClick}
                            variant={action.variant || 'primary'}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
