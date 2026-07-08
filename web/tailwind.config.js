/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9f5',
                    100: '#e0f2ea',
                    200: '#c1e5d5',
                    300: '#a3d8c0',
                    400: '#84cbab',
                    500: '#1A6E3C',
                    600: '#155c32',
                    700: '#104a28',
                    800: '#0a381e',
                    900: '#052614',
                },
                secondary: {
                    50: '#fef5e7',
                    100: '#fdebd0',
                    200: '#f9d5a1',
                    300: '#f5bf72',
                    400: '#f1a943',
                    500: '#E8963C',
                    600: '#d67e2d',
                    700: '#b86626',
                    800: '#9a4e1f',
                    900: '#7c3618',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                neutral: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
