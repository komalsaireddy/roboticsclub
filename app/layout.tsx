import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AudioToggle from "@/components/AudioToggle";
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
  metadataBase: new URL("https://roboticsclub-eight.vercel.app"),
  title: "Robotics Club GCET — Engineering The Future",
  description: "Official platform of the Robotics Club of Geetanjali College of Engineering and Technology. Explore autonomous projects, competitions, workshops, and team initiatives.",
  keywords: ["Robotics Club", "GCET", "Geetanjali College", "Robotica", "Autonomous Systems", "Embedded Engineering", "Competitions"],
  authors: [{ name: "K. Komal Sai Reddy (Tech Lead)" }],
  openGraph: {
    title: "Robotics Club GCET — Engineering The Future",
    description: "Official platform of the Robotics Club of Geetanjali College of Engineering and Technology.",
    url: "https://roboticsclub-eight.vercel.app",
    siteName: "Robotics Club GCET",
    images: [
      {
        url: "/robotics-club-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Robotics Club GCET Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Robotics GCET",
  },
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Robotics Club GCET",
  url: "https://roboticsclub-eight.vercel.app",
  logo: "https://roboticsclub-eight.vercel.app/robotics-club-logo.jpg",
  description: "Official Robotics Club of Geetanjali College of Engineering and Technology.",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Geetanjali College of Engineering and Technology",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030303] text-white">
        {/* Skip to Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:rounded-md focus:bg-cyan-400 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:text-black"
        >
          Skip to main content
        </a>

        {/* Main Content */}
        <div id="main-content" className="flex-1">
          {children}
        </div>

        {/* Audio Toggle Floating Control */}
        <AudioToggle />
      </body>
    </html>
  );
}
