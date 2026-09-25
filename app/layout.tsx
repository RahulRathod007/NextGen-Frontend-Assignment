import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'CartZone · Product Admin',
  description: 'Product admin dashboard powered by DummyJSON',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
