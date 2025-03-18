"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeIn } from "../utils/animations"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText?: string
  buttonAction?: () => void
}

export function EmptyState({ icon, title, description, buttonText, buttonAction }: EmptyStateProps) {
  return (
    <motion.div {...fadeIn} className="py-10 flex flex-col items-center justify-center text-center">
      <div className="bg-primary/10 p-5 rounded-full mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
      {buttonText && buttonAction && (
        <Button onClick={buttonAction} className="gap-2">
          {buttonText}
        </Button>
      )}
    </motion.div>
  )
}

