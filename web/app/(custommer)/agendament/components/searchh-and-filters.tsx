"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { DatePicker } from "./date-picker"

interface SearchAndFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  filters: {
    status: string
    priceRange: number[]
    dateRange: {
      from: Date | undefined
      to: Date | undefined
    }
  }
  setFilters: (filters: any) => void
}

export function SearchAndFilters({ searchTerm, setSearchTerm, filters, setFilters }: SearchAndFiltersProps) {
  const [tempFilters, setTempFilters] = useState(filters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const activeFiltersCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 300 ? 1 : 0) +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0)

  const handleApplyFilters = () => {
    setFilters(tempFilters)
    setIsFiltersOpen(false)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      status: "all",
      priceRange: [0, 300],
      dateRange: {
        from: undefined,
        to: undefined,
      },
    }
    setTempFilters(resetFilters)
    setFilters(resetFilters)
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por serviço, profissional..."
          className="pl-10 pr-4 border-border text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 whitespace-nowrap hover:bg-secondary/80 hover:text-secondary-foreground"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={tempFilters.status}
                onValueChange={(value) => setTempFilters({ ...tempFilters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Faixa de Preço</Label>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>R${tempFilters.priceRange[0]}</span>
                  <span>R${tempFilters.priceRange[1]}</span>
                </div>
              </div>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={tempFilters.priceRange}
                onValueChange={(value) => setTempFilters({ ...tempFilters, priceRange: value as number[] })}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="text-xs">De</Label>
                  <DatePicker
                    date={tempFilters.dateRange.from}
                    setDate={(date) =>
                      setTempFilters({
                        ...tempFilters,
                        dateRange: { ...tempFilters.dateRange, from: date },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs">Até</Label>
                  <DatePicker
                    date={tempFilters.dateRange.to}
                    setDate={(date) =>
                      setTempFilters({
                        ...tempFilters,
                        dateRange: { ...tempFilters.dateRange, to: date },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={handleResetFilters}>
              Limpar
            </Button>
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

