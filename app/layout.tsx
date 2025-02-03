import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

import { Providers } from "@/app/providers";

import { fontSans } from "@/config/fonts";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "ADMIN",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="flex-grow lg:ml-64">
              {/* Toaster with Dark Theme Support */}
              <Toaster
                toastOptions={{
                  className: "bg-background text-default-500 dark:bg-gray-800 dark:text-white",
                  style: {
                    borderRadius: "8px",
                    padding: "12px",
                  },
                }}
              />
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://abic-realty.com"  // Replace with your actual website link
                title="Abic Realty and Consultancy Corporation"
              >
                <p className="text-primary">Abic Realty and Consultancy Corporation</p>
              </Link>
              <span className="text-default-600 text-sm ml-2">| All rights reserved</span>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}