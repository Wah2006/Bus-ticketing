import { useQuery } from '@tanstack/react-query';
import { useI18n } from '../../hooks/useI18n';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../auth/useAuth';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { SkeletonLoader, EmptyState } from '../../components/ui/StateComponents';

export default function MyBookingsPage() {
    const { t } = useI18n();
    const { user } = useAuth();

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['bookings', user?.id],
        queryFn: () => apiClient.get('/bookings/my-bookings'),
        enabled: !!user,
    });

    const columns = [
        {
            key: 'reference',
            label: t('booking.bookingReference'),
        },
        {
            key: 'route',
            label: 'Route',
            render: (_, row) => `${row.tripFrom} → ${row.tripTo}`,
        },
        {
            key: 'date',
            label: t('search.date'),
            render: (date) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        },
        {
            key: 'seatNumber',
            label: 'Seat',
        },
        {
            key: 'status',
            label: t('booking.bookingStatus'),
            render: (status) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${status === 'confirmed' ? 'bg-success/10 text-success' :
                        status === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-danger/10 text-danger'
                    }`}>
                    {status}
                </span>
            ),
        },
        {
            key: 'id',
            label: t('common.save'),
            render: (id) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `/bookings/${id}`}
                >
                    {t('booking.viewTicket')}
                </Button>
            ),
        },
    ];

    if (isLoading) return <SkeletonLoader count={5} />;

    if (!bookings || bookings.length === 0) {
        return (
            <EmptyState
                title={t('booking.title')}
                description="You haven't made any bookings yet"
                action={
                    <Button
                        onClick={() => window.location.href = '/search'}
                    >
                        {t('search.title')}
                    </Button>
                }
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-6">{t('account.myBookings')}</h1>
            <Table columns={columns} data={bookings} />
        </div>
    );
}
