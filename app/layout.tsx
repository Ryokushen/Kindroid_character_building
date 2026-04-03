import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kindroid Character Workbench",
  description: "Local-first workspace for managing Kindroid source documents and generating character drafts.",
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
