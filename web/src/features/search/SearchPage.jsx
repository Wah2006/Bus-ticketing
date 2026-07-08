import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '../../hooks/useI18n';
import { apiClient } from '../../lib/apiClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { SkeletonLoader, EmptyState, ErrorState } from '../../components/ui/StateComponents';
import TripCard from './TripCard';

export default function SearchPage() {
    const { t } = useI18n();
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: '',
    });
    const [searched, setSearched] = useState(false);

    const { data: trips, isLoading, error, refetch } = useQuery({
        queryKey: ['trips', searchParams],
        queryFn: () => apiClient.get('/trips/search', { params: searchParams }),
        enabled: searched,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearched(true);
        refetch();
    };

    const handleSelectTrip = (trip) => {
        window.location.href = `/booking/${trip.id}`;
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-6">{t('search.title')}</h1>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Input
                            label={t('search.from')}
                            placeholder="Douala"
                            value={searchParams.from}
                            onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                            required
                        />
                        <Input
                            label={t('search.to')}
                            placeholder="Yaoundé"
                            value={searchParams.to}
                            onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                            required
                        />
                        <Input
                            label={t('search.date')}
                            type="date"
                            value={searchParams.date}
                            onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                            required
                        />
                        <div className="flex items-end">
                            <Button type="submit" className="w-full">
                                {t('search.search')}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <>
                        {isLoading && <SkeletonLoader count={3} />}

                        {error && (
                            <ErrorState
                                title={t('common.error')}
                                description={t('search.noTripsFound')}
                                onRetry={() => refetch()}
                            />
                        )}

                        {!isLoading && !error && (!trips || trips.length === 0) && (
                            <EmptyState
                                title={t('search.noTripsFound')}
                                description={t('search.tryDifferentDate')}
                                action={
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearched(false)}
                                    >
                                        {t('search.search')}
                                    </Button>
                                }
                            />
                        )}

                        {trips && trips.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-neutral-900">
                                    {trips.length} {t('search.search')}
                                </h2>
                                {trips.map((trip) => (
                                    <TripCard
                                        key={trip.id}
                                        trip={trip}
                                        onSelect={handleSelectTrip}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
