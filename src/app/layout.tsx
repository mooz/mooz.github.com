import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Masafumi Oyamada | Research Scientist",
  description: "Research scientist based in Tokyo, Japan, passionate about maximizing human potential through machines and knowledge. Focused on agentic AI systems, automation, and language model advancement.",
  keywords: [
    "research scientist",
    "machine learning",
    "large language models",
    "automation",
    "computer science",
    "agentic AI",
    "AI systems",
    "Tokyo",
    "Japan",
    "artificial intelligence"
  ],
  authors: [{ name: "Masafumi Oyamada (小山田 昌史)" }],
  openGraph: {
    title: "Masafumi Oyamada | Research Scientist",
    description: "Research scientist based in Tokyo, Japan, passionate about maximizing human potential through machines and knowledge. Focused on agentic AI systems, automation, and language model advancement.",
    type: "profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M4DYTD3SN6"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-M4DYTD3SN6');`}
        </Script>
      </body>
    </html>
  );
}
