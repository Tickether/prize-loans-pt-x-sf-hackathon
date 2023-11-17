import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/app/Provider";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const display = localFont({
  src: "../assets/fonts/gintoNord-bold.woff",
  display: "swap",
  variable: "--display-tf",
  preload: true,
});
const body = localFont({
  src: "../assets/fonts/ginto.woff",
  display: "swap",
  variable: "--body-tf",
  preload: true,
});
const gintoMd = localFont({
  src: "../assets/fonts/gintoNord-md.woff",
  display: "swap",
  variable: "--ginto-md",
  preload: true,
});

export const metadata: Metadata = {
  title: "APP Name",
  description: "App Discription",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${display.variable} ${gintoMd.variable} font-body antialiased`}
      >
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
