import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Intro, INTRO_DECIDE_SCRIPT } from "@/components/intro";
import { IntroController } from "@/components/intro-controller";
import { author, euklo, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Isoklo · Proof before merge.", template: "%s · Isoklo" },
  description: site.description,
  applicationName: "Isoklo",
  authors: [{ name: author.name, url: author.links[0].href }],
  creator: author.name,
  publisher: euklo.name,
  openGraph: {
    title: "Isoklo · Proof before merge.",
    description: site.description,
    url: "/",
    siteName: "Isoklo",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Isoklo · Proof before merge.", description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f3",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_DECIDE_SCRIPT }} />
      </head>
      <body>
        <Intro />
        <IntroController />
        <div data-page>{children}</div>
      </body>
    </html>
  );
}
