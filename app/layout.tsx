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

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_PAGES_REPO ?? "Py_and_Pour";
const pagesBasePath = isGitHubPages ? `/${repositoryName}` : "";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const socialImage = configuredSiteUrl
  ? new URL(`${pagesBasePath}/og.png`, configuredSiteUrl).toString()
  : undefined;
const title = "Py & Pour — Coffee Break Coding Club";
const description =
  "Practice Python through cozy, bite-sized coding quests with a playful roadmap and real in-browser code execution.";

export const metadata: Metadata = {
  ...(configuredSiteUrl ? { metadataBase: new URL(configuredSiteUrl) } : {}),
  title,
  description,
  icons: {
    icon: `${pagesBasePath}/favicon.svg`,
    shortcut: `${pagesBasePath}/favicon.svg`,
  },
  openGraph: {
    type: "website",
    title,
    description,
    ...(socialImage
      ? { images: [{ url: socialImage, width: 1536, height: 904 }] }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(socialImage ? { images: [socialImage] } : {}),
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
