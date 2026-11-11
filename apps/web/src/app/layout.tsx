import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/lib/query-client';

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
      <body className="bg-[#060e20] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}

