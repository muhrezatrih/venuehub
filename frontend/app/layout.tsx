import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'VenueHub | Find & Book Event Spaces',
    template: '%s | VenueHub',
  },
  description:
    'Discover and book unique venues for your next event. From intimate gatherings to grand celebrations.',
  keywords: [
    'venue booking',
    'event spaces',
    'meeting rooms',
    'party venues',
    'corporate events',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased text-stone-900 bg-stone-50">
        {children}
      </body>
    </html>
  );
}
