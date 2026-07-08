import { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from './useAuth';

export default function LoginPage() {
    const { t } = useI18n();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            window.location.href = '/search';
        } catch (err) {
            setError(t(`errors.${err.code || 'INVALID_CREDENTIALS'}`));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-primary-600 mb-2">{t('auth.login')}</h1>
                <p className="text-neutral-600 mb-8">{t('auth.haveAccount')}</p>

                {error && (
                    <div className="mb-4 p-3 bg-danger/10 border border-danger text-danger rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder={t('auth.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 text-primary-600 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-neutral-600">
                            {t('auth.rememberMe')}
                        </label>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? t('common.loading') : t('auth.login')}
                    </Button>
                </form>

                <p className="mt-6 text-center text-neutral-600">
                    {t('auth.noAccount')}{' '}
                    <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                        {t('auth.register')}
                    </a>
                </p>
            </div>
        </div>
    );
}
