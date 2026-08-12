export const dynamic = "force-dynamic"

import type { Metadata } from "next";
import { Geist, EB_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSiteUrl } from "@/lib/site-url";
import {
  createPublicPageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/seo";
import { RootClientLayout } from "@/components/root-client-layout";
import { getPublicHomepageData } from "@/lib/data/public";

const displayFont = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
});

const geistSans = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  ...createPublicPageMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
    absoluteTitle: true,
    keywords: [
      "riswandi wedding",
      "mc pernikahan jakarta",
      "mc wedding profesional",
      "undangan digital elegan",
      "jasa mc wedding",
      "mc akad nikah",
      "pembawa acara pernikahan",
      "undangan digital pernikahan",
      "jasa MC Pernikahan Jakarta",
      "MC pernikahan baper",
      "MC Wedding Bekasi",
      "MC Wedding Bogor",
      "MC Wedding Depok",
      "MC Wedding Tangerang",
      "MC Pernikahan Murah",
      "MC Pernikahan Islami",
      "MC Pernikahan Lucu",
      "MC Pernikahan Sunda",
      "MC Pernikahan Jawa",
      "MC Pernikahan Modern",
      "Undangan Pernikahan Digital",
      "Undangan Pernikahan Online",
      "wedding invitation website",
      "wedding MC Jakarta",
      "MC resepsi pernikahan",
      "undangan pernikahan elegan murah",
      "undangan pernikahan online murah",
      "mc pernikahan jakarta murah",
      "undangan pernikahan islami jakarta",
      "undangan pernikahan islami elegan",
      "undangan pernikahan islami modern",
      "undangan pernikahan islami lucu",
      "undangan pernikahan islami sunda",
      "undangan pernikahan islami jawa",
      "undangan pernikahan islami bekasi",
      "undangan pernikahan islami bogor",
      "undangan pernikahan islami depok",
      "undangan pernikahan islami tangerang",
      "undangan pernikahan islami murah bekasi",
      "undangan pernikahan islami murah bogor",
      "undangan pernikahan islami murah depok",
      "undangan pernikahan islami murah tangerang"
    ],
  }),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Riswandi Wedding - MC & Undangan Digital Profesional",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
    creator: "@riswandiwedding",
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPublicHomepageData();

  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={cn("h-full antialiased", geistSans.variable, displayFont.variable)}
    >
      <body className="flex min-h-full flex-col font-sans">
        <TooltipProvider>
          <RootClientLayout settings={data.settings}>
            {children}
          </RootClientLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}
