import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "Deep South Player Hub",
  description: "Player development and recruiting management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}