export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 text-neutral-300 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-white mb-3">VibeCoding</h3>
                        <p className="text-sm">Reliable bus booking platform for Cameroon</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-primary-400">Home</a></li>
                            <li><a href="/search" className="hover:text-primary-400">Search Trips</a></li>
                            <li><a href="/contact" className="hover:text-primary-400">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/faq" className="hover:text-primary-400">FAQ</a></li>
                            <li><a href="/help" className="hover:text-primary-400">Help Center</a></li>
                            <li><a href="/about" className="hover:text-primary-400">About Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/privacy" className="hover:text-primary-400">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-primary-400">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-700 pt-6 text-center text-sm">
                    <p>&copy; {currentYear} VibeCoding. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
