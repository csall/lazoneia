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
  title: "LaZoneIA | Agents IA Spécialisés",
  description: "Découvrez nos agents IA spécialisés, conçus pour répondre à vos besoins en marketing, support, rédaction, traduction et bien plus encore.",
  icons: {
    icon: [
      { url: 'https://www.lazoneia.com/favicon.ico', sizes: 'any' },
      { url: 'https://www.lazoneia.com/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: 'https://www.lazoneia.com/favicon-large.svg', type: 'image/svg+xml' }
    ]
  },
  manifest: 'https://www.lazoneia.com/manifest.json'
};

// Configuration du viewport séparée selon les recommandations de Next.js
export const viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="https://www.lazoneia.com/favicon.ico" sizes="any" />
        <link rel="icon" href="https://www.lazoneia.com/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="https://www.lazoneia.com/favicon-large.svg" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
