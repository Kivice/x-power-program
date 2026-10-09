import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoAccountsBanner from '@/components/DemoAccountsBanner';

export const metadata: Metadata = {
  title: 'X Power Program | Premier Employment & Job Matching Platform Kenya',
  description:
    'Connecting Kenyan talent with verified employers. Discover top opportunities across Nairobi, Mombasa, Kisumu and remote tech roles. Powered by transparent skill matching.',
  keywords: [
    'Jobs in Kenya',
    'Nairobi tech jobs',
    'X Power Program',
    'Kenya recruitment',
    'M-PESA careers',
    'Verified employers Kenya',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <DemoAccountsBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
