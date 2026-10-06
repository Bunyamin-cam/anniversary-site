import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Bizim Hikâyemiz", description: "Bazı anlar, sonsuza kadar bizimle kalır.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="tr"><body>{children}</body></html>; }
