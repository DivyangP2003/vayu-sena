import type { Metadata } from 'next';
import { Syne, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vayu Sainik — India Air Quality Intelligence',
  description: 'Real-time ward-level AQI, citizen pollution reporting, and AI-powered source attribution for India.',
  keywords: ['air quality', 'AQI', 'India', 'pollution', 'PM2.5', 'Delhi', 'environment'],
  openGraph: {
    title: 'Vayu Sainik',
    description: 'Real-time air quality intelligence for every Indian city',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrains.variable}`}>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <div className="scan-line" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
