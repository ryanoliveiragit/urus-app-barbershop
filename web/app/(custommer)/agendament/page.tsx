"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/shared/footer/footer"
import { LoginBtn } from "@/components/shared/login/login"
import { AppointmentTabs } from "./components/appointment-tabs"
import { ActiveFilters } from "./components/active-filters"
import { useBooking } from "@/hooks/useAgendament"
import { SearchAndFilters } from "./components/searchh-and-filters"

export default function AgendamentosPage() {
  const { status } = useSession()
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const { upcomingAppointments, historyAppointments, isLoading } = useBooking()

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    priceRange: [0, 1000],
    dateRange: {
      from: undefined,
      to: undefined,
    },
  })

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      priceRange: [0, 1000],
      dateRange: {
        from: undefined,
        to: undefined,
      },
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Se o usuário não estiver autenticado, mostra mensagem
  if (status !== "authenticated") {
    return (
      <div className="flex flex-col  bg-background">
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-6 text-center">Faça login para visualizar seus agendamentos</h2>
          <LoginBtn />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background">
      <main className="flex-1 max-w-2xl mx-auto w-full p-4">
        <div className="mb-6 mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-[12px] text-muted-foreground mt-1">Gerencie seus horários e descubra novos serviços</p>
          </div>
          <Button onClick={() => router.push("/agendament/new")} variant="default" size="lg" className="p-3 p-4 gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo</span>
          </Button>
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
        />

        <ActiveFilters
          filters={filters}
          activeFiltersCount={
            (filters.status !== "all" ? 1 : 0) +
            (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
            (filters.dateRange.from || filters.dateRange.to ? 1 : 0)
          }
          handleResetFilters={handleResetFilters}
        />

        <div className="mt-3">
          <AppointmentTabs
            isPageLoading={isPageLoading}
            isLoading={isLoading}
            upcomingAppointments={upcomingAppointments}
            historyAppointments={historyAppointments}
            searchTerm={searchTerm}
            filters={filters}
            onNewAppointment={() => router.push("/agendament/new")}
          />
        </div>
      </main>
    </div>
  )
}

