import { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Button from '../../components/ui/Button';

export default function SeatMapPage({ tripId, onSeatSelect }) {
    const { t } = useI18n();
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatLockTime, setSeatLockTime] = useState(600); // 10 minutes in seconds
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        // Mock seat data - in real app, fetch from API
        const mockSeats = Array.from({ length: 32 }, (_, i) => ({
            number: String(i + 1).padStart(2, '0'),
            status: Math.random() > 0.7 ? 'sold' : 'available',
        }));
        setSeats(mockSeats);
    }, [tripId]);

    useEffect(() => {
        if (!selectedSeat) return;

        const timer = setInterval(() => {
            setSeatLockTime((prev) => {
                if (prev <= 1) {
                    setSelectedSeat(null);
                    return 600;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [selectedSeat]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeatClick = (seat) => {
        if (seat.status === 'available') {
            setSelectedSeat(seat.number);
            setSeatLockTime(600);
            if (onSeatSelect) onSeatSelect(seat);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t('booking.seatMap')}</h2>

            {selectedSeat && (
                <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <p className="text-sm text-neutral-600 mb-1">{t('booking.seatHeld')}</p>
                    <p className="text-2xl font-bold text-primary-600">
                        {t('booking.timeRemaining')}: {formatTime(seatLockTime)}
                    </p>
                </div>
            )}

            {/* Seat Legend */}
            <div className="mb-6 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-200 rounded border border-neutral-400"></div>
                    <span>{t('booking.seatAvailable')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded border border-primary-700"></div>
                    <span>{t('booking.seatSelected')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-warning rounded border border-yellow-600"></div>
                    <span>{t('booking.seatHeldByOther')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-danger rounded border border-red-700"></div>
                    <span>{t('booking.seatSold')}</span>
                </div>
            </div>

            {/* Seat Grid */}
            <div className="mb-8">
                <div className="text-center text-neutral-600 text-sm mb-4 font-semibold">
                    FRONT (Driver)
                </div>
                <div className="grid grid-cols-8 gap-3 max-w-2xl mx-auto mb-8">
                    {seats.map((seat) => {
                        let bgColor = 'bg-neutral-200 cursor-pointer hover:bg-neutral-300';
                        if (seat.status === 'sold') bgColor = 'bg-danger cursor-not-allowed';
                        if (seat.status === 'held') bgColor = 'bg-warning cursor-not-allowed';
                        if (selectedSeat === seat.number) bgColor = 'bg-primary-600';

                        return (
                            <button
                                key={seat.number}
                                onClick={() => handleSeatClick(seat)}
                                disabled={seat.status !== 'available' && seat.number !== selectedSeat}
                                className={`w-10 h-10 rounded border-2 font-semibold text-xs transition-colors ${bgColor} border-neutral-400`}
                            >
                                {seat.number}
                            </button>
                        );
                    })}
                </div>
                <div className="text-center text-neutral-600 text-sm font-semibold">
                    BACK
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline">
                    {t('common.cancel')}
                </Button>
                <Button
                    disabled={!selectedSeat}
                >
                    {t('booking.confirmBooking')}
                </Button>
            </div>
        </div>
    );
}
