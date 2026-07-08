import { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../features/auth/useAuth';

export default function Header() {
    const { t, language, setLanguage } = useI18n();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-primary-600 text-white px-3 py-2 rounded-lg font-bold">
                        VibeCoding
                    </div>
                    <span className="text-sm text-neutral-600 hidden sm:inline">Bus Booking</span>
                </div>

                {/* Nav */}
                <nav className="hidden md:flex gap-6 items-center">
                    <a href="/" className="text-neutral-700 hover:text-primary-600 font-medium">
                        {t('nav.home')}
                    </a>
                    <a href="/search" className="text-neutral-700 hover:text-primary-600 font-medium">
                        {t('nav.search')}
                    </a>
                    {user && (
                        <>
                            <a href="/bookings" className="text-neutral-700 hover:text-primary-600 font-medium">
                                {t('nav.myBookings')}
                            </a>
                            {user.role === 'agency_staff' && (
                                <a href="/admin" className="text-neutral-700 hover:text-primary-600 font-medium">
                                    {t('nav.admin')}
                                </a>
                            )}
                        </>
                    )}
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-2 py-1 text-sm border border-neutral-300 rounded-lg bg-white cursor-pointer"
                    >
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                    </select>

                    {/* User Menu */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                            >
                                {user.firstName || t('common.loading')}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
                                    <a href="/account" className="block px-4 py-2 hover:bg-neutral-100 rounded">
                                        {t('nav.account')}
                                    </a>
                                    <button
                                        onClick={() => {
                                            logout();
                                            window.location.href = '/';
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-danger/10 text-danger rounded"
                                    >
                                        {t('common.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a
                            href="/login"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                        >
                            {t('auth.login')}
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}
