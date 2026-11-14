import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/schibsted-grotesk/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flirt of the Day",
  description: "A tear-off calendar with a fresh pickup line for every day of the year.",
  icons: {
    icon: "/lips.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
