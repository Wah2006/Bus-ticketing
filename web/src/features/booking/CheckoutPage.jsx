import { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SeatMapPage from './SeatMapPage';

export default function CheckoutPage({ booking, onConfirm }) {
    const { t } = useI18n();
    const [passengerData, setPassengerData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onConfirm) onConfirm(passengerData);
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">{t('booking.checkout')}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Seat Selection */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <SeatMapPage />
                        </div>

                        {/* Passenger Details */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('booking.passenger')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label={t('auth.firstName')}
                                        required
                                        value={passengerData.firstName}
                                        onChange={(e) =>
                                            setPassengerData({ ...passengerData, firstName: e.target.value })
                                        }
                                    />
                                    <Input
                                        label={t('auth.lastName')}
                                        required
                                        value={passengerData.lastName}
                                        onChange={(e) =>
                                            setPassengerData({ ...passengerData, lastName: e.target.value })
                                        }
                                    />
                                </div>
                                <Input
                                    type="email"
                                    label={t('auth.email')}
                                    required
                                    value={passengerData.email}
                                    onChange={(e) =>
                                        setPassengerData({ ...passengerData, email: e.target.value })
                                    }
                                />
                                <Input
                                    type="tel"
                                    label={t('auth.phone')}
                                    required
                                    value={passengerData.phone}
                                    onChange={(e) =>
                                        setPassengerData({ ...passengerData, phone: e.target.value })
                                    }
                                />
                                <div className="flex gap-4 pt-4">
                                    <Button variant="outline" className="flex-1">
                                        {t('common.cancel')}
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        {t('booking.proceedToPayment')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar - Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                            <h3 className="text-xl font-bold text-neutral-900 mb-4">{t('booking.bookingSummary')}</h3>

                            <div className="space-y-4 pb-4 border-b border-neutral-200">
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">Trip</span>
                                    <span className="font-semibold">Douala → Yaoundé</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">Date</span>
                                    <span className="font-semibold">12 Jul 2026</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">Seat</span>
                                    <span className="font-semibold">-</span>
                                </div>
                            </div>

                            <div className="mt-4 mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-neutral-600">Price per seat</span>
                                    <span className="font-semibold">15 000 XAF</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-neutral-600">Passengers</span>
                                    <span className="font-semibold">1</span>
                                </div>
                            </div>

                            <div className="bg-primary-50 rounded-lg p-4 mb-4">
                                <div className="flex justify-between">
                                    <span className="font-bold text-neutral-900">{t('booking.totalPrice')}</span>
                                    <span className="font-bold text-primary-600 text-lg">15 000 XAF</span>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-500 text-center">
                                Final price may vary with taxes and fees
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
