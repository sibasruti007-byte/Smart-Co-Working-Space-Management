import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/lib/query-client';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';

export const metadata: Metadata = {
  title: 'SmartSpace & NexusSpace | Intelligent Co-Working Platform',
  description: 'Production-grade co-working space marketplace with real-time IoT availability, telemetry, and smart floorplan reservations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060e20] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300 min-h-screen flex flex-col justify-between">
        <ReactQueryProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

