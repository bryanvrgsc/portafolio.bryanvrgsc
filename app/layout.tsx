import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bryan Vargas - Portafolio",
  description: "Portafolio interactivo de Bryan Vargas simulando macOS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "macOS Tahoe",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

import { SystemProvider } from "@/context/SystemContext";
import { FileSystemProvider } from "@/context/FileSystemContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          <SystemProvider>
            <FileSystemProvider>
              {children}
            </FileSystemProvider>
          </SystemProvider>
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  );
}
