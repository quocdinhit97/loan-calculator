import type { Metadata } from 'next';
import {Inter, JetBrains_Mono, Lexend} from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Loan Calculator',
    description: 'Advanced Loan Amortization Calculator',
};

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains-mono', // Define a CSS variable name
});

const lexend = Lexend({
    subsets: ['latin']
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body className={lexend.className}>{children}</body>
        </html>
    );
}
