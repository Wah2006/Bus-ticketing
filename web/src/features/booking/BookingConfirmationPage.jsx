import { useI18n } from '../../hooks/useI18n';
import Button from '../../components/ui/Button';

export default function BookingConfirmationPage({ booking }) {
    const { t } = useI18n();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary-50 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">✓</div>
                    <h1 className="text-4xl font-bold text-success mb-2">{t('booking.bookingConfirmed')}</h1>
                    <p className="text-neutral-600">{t('booking.eTicketReady')}</p>
                </div>

                {/* E-Ticket */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-2 border-neutral-200">
                    <div className="text-center mb-6">
                        <p className="text-sm font-semibold text-primary-600 mb-2">{t('booking.bookingReference')}</p>
                        <p className="text-3xl font-bold font-mono text-neutral-900">{booking?.reference || 'VB-2026-12345'}</p>
                    </div>

                    <div className="border-b-2 border-dashed border-neutral-300 mb-6 pb-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-semibold text-neutral-600 mb-1">{t('booking.tripDetails')}</p>
                                <p className="font-semibold text-neutral-900">Douala → Yaoundé</p>
                                <p className="text-sm text-neutral-600">14:30 - 17:45</p>
                                <p className="text-sm text-neutral-600 mt-2">{formatDate(booking?.date)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-neutral-600 mb-1">Agency</p>
                                <p className="font-semibold text-neutral-900">{booking?.agency || 'Express Transport'}</p>
                                <p className="text-sm text-neutral-600">Bus: {booking?.busNumber || 'CM-2021-XT'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-xs font-semibold text-neutral-600 mb-1">{t('booking.passenger')}</p>
                            <p className="font-semibold text-neutral-900">{booking?.passengerName || 'John Doe'}</p>
                            <p className="text-sm text-neutral-600">{booking?.passengerPhone}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-neutral-600 mb-1">Seat</p>
                            <p className="text-3xl font-bold text-primary-600">{booking?.seatNumber || '12A'}</p>
                        </div>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-neutral-600 mb-3">QR Code</p>
                        <div className="bg-white p-4 inline-block rounded border border-neutral-200">
                            <div className="w-32 h-32 bg-neutral-100 flex items-center justify-center text-4xl">
                                █
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Price */}
                <div className="bg-primary-50 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-neutral-900">{t('booking.totalPrice')}</p>
                        <p className="text-3xl font-bold text-primary-600">25 000 XAF</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => window.print()}
                    >
                        {t('booking.printTicket')}
                    </Button>
                    <Button
                        className="flex-1"
                    >
                        {t('booking.downloadTicket')}
                    </Button>
                    <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={() => window.location.href = '/bookings'}
                    >
                        {t('nav.myBookings')}
                    </Button>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-xs text-neutral-500 mt-6">
                    Save this confirmation. You can access it anytime in "My Bookings"
                </p>
            </div>
        </div>
    );
}
