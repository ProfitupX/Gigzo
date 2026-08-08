import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gigzo — Sell Anything. No Website Needed.",
  description:
    "India's fastest link-in-bio commerce platform. Indian Instagram creators launch their store in 2 minutes with UPI payments, zero friction checkout, and mobile-first design.",
  keywords: "creator store, link in bio, UPI payments, Indian creator, sell digital products, Instagram store",
  openGraph: {
    title: "Gigzo — Sell Anything. No Website Needed.",
    description:
      "Launch your creator store in 2 minutes. UPI payments, zero friction checkout, mobile-first. Built for Indian Instagram creators.",
    type: "website",
    locale: "en_IN",
  },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
