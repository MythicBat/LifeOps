import type {
  Metadata,
} from "next";

import { Toaster } from "sonner";

import "./globals.css";

import { CommandPalette } from "@/components/lifeops/CommandPalette";
import { GlobalUniversalDrop } from "@/components/lifeops/GlobalUniversalDrop";

export const metadata: Metadata = {
  title: "LifeOps — Life, handled.",
  description:
    "An autonomous AI agent that quietly handles everyday life admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <CommandPalette />

        <GlobalUniversalDrop />

        <Toaster
          position="bottom-right"
          richColors
        />
      </body>
    </html>
  );
}