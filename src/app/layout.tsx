import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/context/toast-context';
import { AuthProvider } from '@/context/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Edu-Voice AI — Autonomous AI Admission Counselor Platform',
  description:
    'Self-service, multi-tenant AI voice communication platform for educational institutions. Handle admissions, fees, courses, and eligibility inquiries 24/7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <ReactQueryProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
