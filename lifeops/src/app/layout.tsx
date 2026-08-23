import type {
  Metadata,
} from "next";

import { Toaster } from "sonner";

import "./globals.css";

import { CommandPalette } from "@/components/lifeops/CommandPalette";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { AuthGuard } from "@/components/auth/AuthGuard";

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
        <AuthInitializer />
        
        <AuthGuard>
          {children}
        </AuthGuard>

        <MobileNavigation />

        <CommandPalette />

        <Toaster
          position="bottom-right"
          richColors
        />
      </body>
    </html>
  );
}