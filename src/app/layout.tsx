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
  }),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
