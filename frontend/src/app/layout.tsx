import "@/styles/globals.css";

import {
  App,
  AppHeader,
  AppHeaderActions,
  AppHeaderTitle,
  AppMain,
} from "@/components/app";
import { AuthSection } from "@/components/auth/AuthSection";
import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unicamp VestIA",
  description: "Chat IA para tirar dúvidas sobre o Vestibular Unicamp 2026.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`}>
      <body>
        <App>
          <AppHeader>
            <AppHeaderTitle asChild>
              <Link href="/">Unicamp VestIA</Link>
            </AppHeaderTitle>

            <AppHeaderActions>
              <AuthSection />
            </AppHeaderActions>
          </AppHeader>

          <AppMain>{children}</AppMain>
        </App>
      </body>
    </html>
  );
}
