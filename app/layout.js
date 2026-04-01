import './globals.css';

export const metadata = {
  title: {
    default: 'S3Drive | Secure S3 File Manager',
    template: '%s | S3Drive',
  },
  description:
    'S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.',
  openGraph: {
    title: 'S3Drive | Secure S3 File Manager',
    description:
      'S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.',
    url: 'https://yourdomain.com/',
    siteName: 'S3Drive',
    images: [
      {
        url: '/next.svg',
        width: 180,
        height: 38,
        alt: 'S3Drive logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S3Drive | Secure S3 File Manager',
    description:
      'S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.',
    images: ['/next.svg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{
          '--font-geist-sans': 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          '--font-geist-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
