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
  title: "Balance Hormones Naturally: PCOS, Thyroid Disorders",
  description:
    "Sia Health provides expert-led, evidence-based care for women's hormonal health issues such as PCOS/PCOD, thyroid disorders, peri-menopause, etc. Our holistic approach combines personalized lifestyle, nutrition, and exercise solutions for lasting well-being and improved health.",

  openGraph: {
    title: "Balance Hormones Naturally: PCOS, Thyroid Disorders",
    description:
      "Expert-led hormonal care for PCOS, thyroid disorders, and peri-menopause. Personalized lifestyle, nutrition & exercise solutions.",
    url: "https://siahealth.in", // change this
    siteName: "Sia Health",
    images: [
      {
        url: "https://siahealth.in/fav_icon.png", // must be absolute URL
        width: 600,
        height: 600,
        alt: "Sia Health - Women's Hormonal Care",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {  
    card: "summary_large_image",
    title: "Balance Hormones Naturally: PCOS, Thyroid Disorders",
    description: "Evidence-based hormonal care for PCOS & thyroid disorders.",
    images: ["https://siahealth.in/fav_icon.png"],
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
