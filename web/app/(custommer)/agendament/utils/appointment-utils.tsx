import { Appointment, Suggestion } from "@/@types/appointment"
import { Award, Plus, Scissors, Sparkles } from "lucide-react"

export function filterAppointments(
  appointments: Appointment[],
  searchTerm: string,
  filters: {
    status: string
    priceRange: number[]
    dateRange: {
      from: Date | undefined
      to: Date | undefined
    }
  },
): Appointment[] {
  if (!appointments) return []

  return appointments.filter((appointment) => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        appointment.professionalName.toLowerCase().includes(searchLower) ||
        appointment.serviceName.toLowerCase().includes(searchLower) ||
        (appointment.professionalSpecialty && appointment.professionalSpecialty.toLowerCase().includes(searchLower))

      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "scheduled" && (appointment.isCanceled || appointment.status === "completed")) {
        return false
      }
      if (filters.status === "canceled" && !appointment.isCanceled) {
        return false
      }
      if (filters.status === "completed" && appointment.status !== "completed") {
        return false
      }
    }

    // Price filter
    const price = Number.parseFloat(appointment.price)
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false
    }

    // Date filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const appointmentDate = new Date(appointment.appointmentDate)

      if (filters.dateRange.from && appointmentDate < filters.dateRange.from) {
        return false
      }

      if (filters.dateRange.to) {
        const endDate = new Date(filters.dateRange.to)
        endDate.setHours(23, 59, 59, 999)

        if (appointmentDate > endDate) {
          return false
        }
      }
    }

    return true
  })
}

// Get suggestions list
export function getSuggestions(router: any): Suggestion[] {
  return [
    {
      id: "novo",
      title: "Novo Agendamento",
      description: "Agende um horário com seu barbeiro preferido",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
          <Plus className="h-6 w-6 text-primary" />
        </div>
      ),
      action: () => router.push("/agendament/new"),
    },
    {
      id: "promocoes",
      title: "Promoções da Semana",
      description: "Veja os serviços com desconto especial",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-amber-500" />
        </div>
      ),
      action: () => router.push("/promocoes"),
    },
    {
      id: "servicos",
      title: "Serviços Premium",
      description: "Conheça nossos serviços exclusivos",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-indigo-500/15 flex items-center justify-center">
          <Award className="h-6 w-6 text-indigo-500" />
        </div>
      ),
      action: () => router.push("/servicos-premium"),
    },
    {
      id: "barbeiros",
      title: "Barbeiros Disponíveis",
      description: "Descubra nossos profissionais",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-green-500/15 flex items-center justify-center">
          <Scissors className="h-6 w-6 text-green-500" />
        </div>
      ),
      action: () => router.push("/barbeiros"),
    },
  ]
}

