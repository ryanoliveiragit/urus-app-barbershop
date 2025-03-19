"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { PhoneVerificationModal } from "./phone-verification-modal"

export function PhoneVerificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user is authenticated and phone is missing
    if (status === "authenticated" && session?.user) {
      const userPhone = session.user.phone
      if (userPhone === null || userPhone === undefined) {
        setIsOpen(true)
      }
    }
  }, [session, status])

  return (
    <>
      {children}
      <PhoneVerificationModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}

