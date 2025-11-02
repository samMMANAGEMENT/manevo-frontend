import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext";
import AxiosLoaderSetup from "./components/AxiosLoaderSetup";

export const metadata: Metadata = {
  title: "manevo",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans bg-white text-black`}>
        <AuthProvider>
          <LoaderProvider>
            <AxiosLoaderSetup />
            {children}
          </LoaderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
