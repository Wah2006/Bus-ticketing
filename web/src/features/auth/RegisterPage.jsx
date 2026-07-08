import { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from './useAuth';

export default function RegisterPage() {
    const { t } = useI18n();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            window.location.href = '/search';
        } catch (err) {
            setError(t(`errors.${err.code || 'SERVER_ERROR'}`));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-primary-600 mb-2">{t('auth.register')}</h1>
                <p className="text-neutral-600 mb-8">{t('auth.haveAccount')}</p>

                {error && (
                    <div className="mb-4 p-3 bg-danger/10 border border-danger text-danger rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            type="text"
                            name="firstName"
                            placeholder={t('auth.firstName')}
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="text"
                            name="lastName"
                            placeholder={t('auth.lastName')}
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        type="email"
                        name="email"
                        placeholder={t('auth.email')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="tel"
                        name="phone"
                        placeholder={t('auth.phone')}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder={t('auth.password')}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder={t('auth.confirmPassword')}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? t('common.loading') : t('auth.register')}
                    </Button>
                </form>

                <p className="mt-6 text-center text-neutral-600">
                    {t('auth.haveAccount')}{' '}
                    <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                        {t('auth.login')}
                    </a>
                </p>
            </div>
        </div>
    );
}
