import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Passwordless Authentication',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={lato.className}>
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-t from-[#00212a] to-[#000125]'>
          {children}
        </div>
      </body>
    </html>
  );
}
