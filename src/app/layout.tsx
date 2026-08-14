import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import BannedBanner from "@/components/BannedBanner";
import UnverifiedBanner from "@/components/UnverifiedBanner";
import KenteBar from "@/components/KenteBar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PubAFric | Vos missions, votre Afrique",
  description:
    "PubAFric met en relation des internautes qui veulent arrondir leurs fins de mois avec des entreprises qui proposent des micro-missions publicitaires. Des missions simples, de l'argent réel — 100% Afrique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AnnouncementBanner />
        <Header />
        <KenteBar />
        <BannedBanner />
        <UnverifiedBanner />
        {children}
        <Footer />
      </body>
    </html>
  );
}
