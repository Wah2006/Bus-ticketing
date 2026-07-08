import { useI18n } from '../../hooks/useI18n';
import Button from '../ui/Button';

export default function TripCard({ trip, onSelect }) {
    const { t } = useI18n();

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const formatPrice = (price) => {
        return `${(price).toLocaleString('fr-FR')} ${t('common.currency')}`;
    };

    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Trip Times */}
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-sm text-neutral-600">{t('search.department')}</p>
                            <p className="text-2xl font-bold text-neutral-900">{formatTime(trip.departureTime)}</p>
                        </div>
                        <div className="flex-1 border-b-2 border-neutral-300 mb-4"></div>
                        <div>
                            <p className="text-sm text-neutral-600">{t('search.arrival')}</p>
                            <p className="text-2xl font-bold text-neutral-900">{formatTime(trip.arrivalTime)}</p>
                        </div>
                    </div>
                </div>

                {/* Agency & Bus */}
                <div className="flex-1">
                    <p className="text-sm font-medium text-primary-600">{trip.agency.name}</p>
                    <p className="text-sm text-neutral-600">{trip.bus.number}</p>
                    <p className="text-xs text-neutral-500 mt-2">Seats: {trip.availableSeats}/{trip.totalSeats}</p>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col justify-between items-end">
                    <p className="text-2xl font-bold text-primary-600">{formatPrice(trip.pricePerSeat)}</p>
                    <Button
                        onClick={() => onSelect(trip)}
                        size="md"
                    >
                        {t('search.selectTrip')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
