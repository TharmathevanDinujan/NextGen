import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Nextgen Institute",
  description: "Empowering students with quality education for a successful future.",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
      { url: "/images/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/images/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/images/favicon.ico",
  },
  manifest: "/manifest.json",
  themeColor: "#004d40",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    title: "Nextgen Institute",
    description: "Empowering students with quality education for a successful future.",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Nextgen Institute Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextgen Institute",
    description: "Empowering students with quality education for a successful future.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
