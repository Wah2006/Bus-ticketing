import { useQuery } from '@tanstack/react-query';
import { useI18n } from '../../../hooks/useI18n';
import { apiClient } from '../../../lib/apiClient';
import { useAuth } from '../../../features/auth/useAuth';   // ← Fixed path
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { SkeletonLoader } from '../../../components/ui/StateComponents';

export default function AdminDashboard() {
    const { t } = useI18n();
    const { user } = useAuth();

    const { data: trips, isLoading } = useQuery({
        queryKey: ['admin', 'trips', user?.agencyId],
        queryFn: () => apiClient.get('/admin/trips'),
        enabled: !!user && user.role === 'agency_staff',
    });

    const columns = [
        {
            key: 'id',
            label: 'ID',
        },
        {
            key: 'route',
            label: 'Route',
            render: (_, row) => `${row.from} → ${row.to}`,
        },
        {
            key: 'date',
            label: t('search.date'),
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            key: 'bus',
            label: t('admin.busNumber'),
        },
        {
            key: 'status',
            label: t('admin.status'),
            render: (status) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${status === 'active' ? 'bg-success/10 text-success' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                    {status}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                        {t('common.edit')}
                    </Button>
                    <Button size="sm" variant="danger">
                        {t('common.delete')}
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <SkeletonLoader count={5} />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-900">{t('admin.title')}</h1>
                <Button onClick={() => window.location.href = '/admin/trips/new'}>
                    {t('admin.addTrip')}
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('admin.trips')}</h2>
                <Table columns={columns} data={trips || []} />
            </div>
        </div>
    );
}
