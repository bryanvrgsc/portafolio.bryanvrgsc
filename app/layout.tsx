import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bryan Vargas - Portafolio",
  description: "Portafolio interactivo de Bryan Vargas simulando macOS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "macOS Tahoe",
  },
};

import { SystemProvider } from "@/context/SystemContext";
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
            {children}
          </SystemProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
