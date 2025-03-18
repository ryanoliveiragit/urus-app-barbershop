"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { fadeIn } from "../utils/animations"
import { Suggestion } from "@/@types/appointment"

interface SuggestionCardProps {
  suggestion: Suggestion
  onClick: () => void
}

export function SuggestionCard({ suggestion, onClick }: SuggestionCardProps) {
  return (
    <motion.div {...fadeIn}>
      <Card
        className="mb-4 cursor-pointer overflow-hidden group border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-4">
            <div className="flex-shrink-0">{suggestion.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {suggestion.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

