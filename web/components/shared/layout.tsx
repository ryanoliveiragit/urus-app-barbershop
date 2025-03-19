"use client"

import type React from "react"
import { Footer } from "./footer/footer"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">{children}</main>
      <Footer className="fixed bottom-0 left-0 right-0 z-10" />
    </div>
  )
}

