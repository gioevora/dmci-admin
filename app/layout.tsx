import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/providers";
import Navbar from "@/components/navbar";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "ADMIN",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
  variable: "--font-poppins", // Correct variable assignment
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={`min-h-screen bg-background ${poppins.className}`}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="flex-grow lg:ml-64">
              {/* Toaster with Dark Theme Support */}
              <Toaster
                toastOptions={{
                  className:
                    "bg-background text-default-500 dark:bg-gray-800 dark:text-white",
                  style: {
                    borderRadius: "8px",
                    padding: "12px",
                  },
                }}
              />
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
