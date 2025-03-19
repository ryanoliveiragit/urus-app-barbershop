"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { Calendar, Clock, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AppointmentCard } from "./appointment-card"
import { EmptyState } from "./empty-state"
import { SuggestionCard } from "./suggestion-card"
import { Appointment } from "@/@types/appointment"
import { filterAppointments, getSuggestions } from "../utils/appointment-utils"
import { AppointmentSkeleton } from "./appointment-skeleton"


interface AppointmentTabsProps {
  isPageLoading: boolean
  isLoading: boolean
  upcomingAppointments: Appointment[]
  historyAppointments: Appointment[]
  searchTerm: string
  filters: any
  onNewAppointment: () => void
}

export function AppointmentTabs({
  isPageLoading,
  isLoading,
  upcomingAppointments,
  historyAppointments,
  searchTerm,
  filters,
  onNewAppointment,
}: AppointmentTabsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("proximos")
  const suggestions = getSuggestions(router)

  const filteredUpcoming = filterAppointments(upcomingAppointments, searchTerm, filters)
  const filteredHistory = filterAppointments(historyAppointments, searchTerm, filters)

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6 w-full">
        <TabsTrigger value="proximos" className="text-sm">
          Próximos
        </TabsTrigger>
        <TabsTrigger value="historico" className="text-sm">
          Histórico
        </TabsTrigger>
        <TabsTrigger value="sugestoes" className="text-sm">
          Sugestões
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <TabsContent value="proximos" key="proximos">
          {isPageLoading || isLoading ? (
            <div className="max-h-[calc(100vh-20vh)] overflow-y-auto pr-2 space-y-4">
              <AppointmentSkeleton />
              <AppointmentSkeleton />
            </div>
          ) : !filteredUpcoming || filteredUpcoming.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-primary" />}
              title={
                searchTerm || filters.status !== "all" ? "Nenhum resultado encontrado" : "Sem agendamentos próximos"
              }
              description={
                searchTerm || filters.status !== "all"
                  ? "Tente ajustar seus filtros ou termos de busca"
                  : "Você não tem nenhum horário agendado. Que tal marcar um agora?"
              }
              buttonText={searchTerm || filters.status !== "all" ? undefined : "Agendar Horário"}
              buttonAction={searchTerm || filters.status !== "all" ? undefined : onNewAppointment}
            />
          ) : (
            <div className="max-h-[calc(100vh-44vh)] overflow-y-auto pr-2 space-y-4">
              {filteredUpcoming.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}

              <Button
                variant="outline"
                className="w-full mt-4 py-6 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                onClick={onNewAppointment}
              >
                <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Novo Agendamento
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico" key="historico">
          {isPageLoading || isLoading ? (
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4">
              <AppointmentSkeleton />
              <AppointmentSkeleton />
              <AppointmentSkeleton />
            </div>
          ) : !filteredHistory || filteredHistory.length === 0 ? (
            <EmptyState
              icon={<Clock className="h-8 w-8 text-muted-foreground" />}
              title={searchTerm || filters.status !== "all" ? "Nenhum resultado encontrado" : "Nenhum histórico"}
              description={
                searchTerm || filters.status !== "all"
                  ? "Tente ajustar seus filtros ou termos de busca"
                  : "Você ainda não tem agendamentos concluídos."
              }
            />
          ) : (
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-4">
              {filteredHistory.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isHistory={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sugestoes" key="sugestoes">
          <div className="grid grid-cols-1 gap-3 pt-1 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} onClick={suggestion.action} />
            ))}
          </div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  )
}

