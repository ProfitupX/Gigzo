import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://profitupx.com'),
  title: {
    default: "ProfitupX — Sell Anything. No Website Needed.",
    template: "%s | ProfitupX"
  },
  description:
    "India's fastest link-in-bio commerce platform. Launch your store in 2 minutes with UPI payments, zero friction checkout, and mobile-first design.",
  keywords: ["creator store", "link in bio", "UPI payments", "Indian creator", "sell digital products", "Instagram store", "ProfitupX", "ProfitupX"],
  authors: [{ name: "ProfitupX" }],
  creator: "ProfitupX",
  publisher: "ProfitupX",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ProfitupX — Sell Anything. No Website Needed.",
    description:
      "Launch your creator store in 2 minutes. UPI payments, zero friction checkout, mobile-first. Built for Indian Instagram creators.",
    url: 'https://profitupx.com',
    siteName: 'ProfitupX',
    images: [
      {
        url: 'https://i.ibb.co/jkQ7YQwJ/profitup.png', // Fallback to company logo if no OG image
        width: 800,
        height: 600,
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: 'summary_large_image',
    title: "ProfitupX — Sell Anything. No Website Needed.",
    description: "Launch your creator store in 2 minutes. UPI payments, zero friction checkout, mobile-first.",
    creator: '@profitupx',
    images: ['https://i.ibb.co/jkQ7YQwJ/profitup.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ProfitupX',
  url: 'https://profitupx.com',
  logo: 'https://i.ibb.co/jkQ7YQwJ/profitup.png',
  sameAs: [
    'https://instagram.com/profitupx', // Example, replace with real
  ],
  brand: {
    '@type': 'Brand',
    name: 'ProfitupX',
    logo: 'https://i.ibb.co/jkQ7YQwJ/profitup.png'
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
