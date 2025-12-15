import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SocketProvider } from '@/context/socketContext';
import { DraftProvider } from '@/context/DraftContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MLBB Pick & Ban System',
  description: 'Professional MPL-style draft system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>
          <DraftProvider>
            {children}
          </DraftProvider>
        </SocketProvider>
      </body>
    </html>
  );
}