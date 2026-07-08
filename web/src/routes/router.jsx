import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProtectedRoute from '../components/layout/ProtectedRoute';

import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import SearchPage from '../features/search/SearchPage';
import CheckoutPage from '../features/booking/CheckoutPage';
import BookingConfirmationPage from '../features/booking/BookingConfirmationPage';
import MyBookingsPage from '../features/account/MyBookingsPage';
import AdminDashboard from '../features/admin/dashboard/DashboardPage';

export default function AppRouter() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route path="/search" element={<SearchPage />} />

                        <Route
                            path="/booking/:tripId"
                            element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/booking/confirmation/:bookingId"
                            element={
                                <ProtectedRoute>
                                    <BookingConfirmationPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/bookings"
                            element={
                                <ProtectedRoute>
                                    <MyBookingsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute requiredRole="agency_staff">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}