import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Amazon Bliss — Yerba Mate Energy",
  description:
    "Cold-brewed yerba mate with pressed fruit. Four flavors from the loudest place on earth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrains.variable} grain font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
