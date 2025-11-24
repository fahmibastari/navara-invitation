// app/layout.tsx
import type { Metadata } from "next"
import { Inter, Hind_Madurai } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const hind = Hind_Madurai({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
})

export const metadata: Metadata = {
  title: "Navara City Park",
  description: "More Than Just A Destination",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${hind.variable} font-inter bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  )
}
