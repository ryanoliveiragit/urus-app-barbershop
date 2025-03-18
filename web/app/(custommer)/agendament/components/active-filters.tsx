"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ActiveFiltersProps {
  filters: {
    status: string
    priceRange: number[]
    dateRange: {
      from: Date | undefined
      to: Date | undefined
    }
  }
  activeFiltersCount: number
  handleResetFilters: () => void
}

export function ActiveFilters({ filters, activeFiltersCount, handleResetFilters }: ActiveFiltersProps) {
  if (activeFiltersCount === 0) return null

  return (
    <div className="mt-2 flex gap-2 flex-wrap">
      <Button variant="outline" size="sm" className="h-8 px-2 text-xs font-medium" onClick={handleResetFilters}>
        Limpar filtros
        <X className="ml-1 h-3 w-3" />
      </Button>

      {filters.status !== "all" && (
        <Badge variant="secondary" className="rounded-md px-3 py-1 bg-secondary/80">
          Status:{" "}
          {filters.status === "scheduled" ? "Agendado" : filters.status === "canceled" ? "Cancelado" : "Concluído"}
        </Badge>
      )}

      {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
        <Badge variant="secondary" className="rounded-md px-3 py-1 bg-secondary/80">
          Preço: R${filters.priceRange[0]} - R${filters.priceRange[1]}
        </Badge>
      )}

      {(filters.dateRange.from || filters.dateRange.to) && (
        <Badge variant="secondary" className="rounded-md px-3 py-1 bg-secondary/80">
          Data: {filters.dateRange.from ? format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : ""}
          {filters.dateRange.from && filters.dateRange.to ? " - " : ""}
          {filters.dateRange.to ? format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : ""}
        </Badge>
      )}
    </div>
  )
}

