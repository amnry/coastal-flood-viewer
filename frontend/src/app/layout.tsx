import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coastal Flood Viewer',
  description: 'Explore sea level rise, coastal elevation, and hurricane impacts with interactive visualizations',
  keywords: ['coastal flooding', 'sea level rise', 'hurricane impacts', 'climate change', 'coastal elevation'],
  authors: [{ name: 'Coastal Flood Viewer Team' }],
  openGraph: {
    title: 'Coastal Flood Viewer',
    description: 'Explore sea level rise, coastal elevation, and hurricane impacts with interactive visualizations',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coastal Flood Viewer',
    description: 'Explore sea level rise, coastal elevation, and hurricane impacts with interactive visualizations',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <div className="min-h-full">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}