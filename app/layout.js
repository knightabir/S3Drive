import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "S3Drive | Secure S3 File Manager",
    template: "%s | S3Drive",
  },
  description: "S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.",
  openGraph: {
    title: "S3Drive | Secure S3 File Manager",
    description: "S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.",
    url: "https://yourdomain.com/",
    siteName: "S3Drive",
    images: [
      {
        url: "/next.svg",
        width: 180,
        height: 38,
        alt: "S3Drive logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "S3Drive | Secure S3 File Manager",
    description: "S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.",
    images: ["/next.svg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
