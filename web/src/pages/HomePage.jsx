import { useI18n } from '../hooks/useI18n';
import Button from '../components/ui/Button';

export default function HomePage() {
    const { t } = useI18n();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Book Your Bus Ticket
                            </h1>
                            <p className="text-xl text-primary-100 mb-8">
                                Fast, reliable, and secure bus booking for Cameroon. Find trips, book seats, and get your e-ticket instantly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={() => window.location.href = '/search'}
                                    className="bg-white text-primary-600 hover:bg-primary-50"
                                >
                                    {t('search.title')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = '/login'}
                                    className="border-white text-white"
                                >
                                    {t('auth.login')}
                                </Button>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/20 rounded-lg p-8 backdrop-blur">
                                <div className="text-6xl mb-4">🚌</div>
                                <p className="text-lg font-semibold">Book safely with ease</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-neutral-900 mb-12">
                        Why Choose VibeCoding?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '⚡',
                                title: 'Fast & Easy',
                                desc: 'Book your bus ticket in seconds with our intuitive interface',
                            },
                            {
                                icon: '🔒',
                                title: 'Secure Payment',
                                desc: 'Your transactions are safe with our encrypted payment system',
                            },
                            {
                                icon: '📱',
                                title: 'E-Ticket Anytime',
                                desc: 'Access your tickets anywhere, anytime with our digital tickets',
                            },
                            {
                                icon: '🌍',
                                title: '24/7 Support',
                                desc: 'Our support team is always available to help you',
                            },
                            {
                                icon: '✓',
                                title: 'Best Prices',
                                desc: 'Find the best deals on direct routes across Cameroon',
                            },
                            {
                                icon: '🚀',
                                title: 'Multi-language',
                                desc: 'Available in English and French for your convenience',
                            },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-neutral-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                                <p className="text-neutral-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-secondary-500 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Book Your Journey?</h2>
                    <p className="text-xl text-secondary-100 mb-8">
                        Start searching for your next trip now
                    </p>
                    <Button
                        onClick={() => window.location.href = '/search'}
                        className="bg-white text-secondary-500 hover:bg-secondary-50 px-8 py-3 text-lg"
                    >
                        {t('search.title')}
                    </Button>
                </div>
            </section>
        </div>
    );
}
