"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Plus,
  Star,
  MessageSquare,
  Award,
  Scissors,
  Sparkles,
  ChevronRight,
  MoreHorizontal,
  X,
  CalendarIcon,
  Search,
  Filter,
} from "lucide-react"

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Shared components
import { Footer } from "@/components/shared/footer/footer"
import { LoginBtn } from "@/components/shared/login/login"
import { useBooking } from "@/hooks/useBooking"
import { cn } from "@/lib/utils"

// ===== TYPES =====
interface Appointment {
  id: string
  professionalName: string
  professionalSpecialty?: string
  professionalImage?: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  price: string
  isCanceled?: boolean
}

interface Suggestion {
  id: string
  title: string
  description: string
  icon: ReactNode
  action: () => void
}

interface FadeInAnimation {
  initial: { opacity: number; y: number }
  animate: { opacity: number; y: number }
  exit: { opacity: number; y: number }
  transition: { duration: number }
}

// ===== ANIMATIONS =====
const fadeIn: FadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
}

// ===== UTILITY FUNCTIONS =====
// Format date to DD/MM/YYYY
function formatDateMask(dateStr: string): string {
  try {
    // Check if the date is already in the correct format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr
    }

    // Handle ISO format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [year, month, day] = dateStr.split("T")[0].split("-")
      return `${day}/${month}/${year}`
    }

    // Try to parse the date
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date")
    }

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch (e) {
    console.error("Error formatting date:", e)
    return dateStr
  }
}

// Format currency to BRL
function formatCurrency(value: string | number): string {
  try {
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue)
  } catch (e) {
    console.error("Error formatting currency:", e)
    return `R$ ${value}`
  }
}

// Filter appointments based on search and filters
function filterAppointments(
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
      if (filters.status === "scheduled" && (appointment.isCanceled || false)) {
        return false
      }
      if (filters.status === "canceled" && !appointment.isCanceled) {
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
function getSuggestions(router: any): Suggestion[] {
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

// ===== COMPONENTS =====
// Date Picker Component
interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={ptBR}
          disabled={(date) => date < new Date("1900-01-01")}
        />
      </PopoverContent>
    </Popover>
  )
}

// Search and Filters Component
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

function SearchAndFilters({ searchTerm, setSearchTerm, filters, setFilters }: SearchAndFiltersProps) {
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
          className="pl-10 pr-4"
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
          <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
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

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText?: string
  buttonAction?: () => void
}

function EmptyState({ icon, title, description, buttonText, buttonAction }: EmptyStateProps) {
  return (
    <motion.div {...fadeIn} className="py-10 flex flex-col items-center justify-center text-center">
      <div className="bg-accent/20 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
      {buttonText && buttonAction && (
        <Button onClick={buttonAction} className="gap-2">
          <Plus className="h-4 w-4" />
          {buttonText}
        </Button>
      )}
    </motion.div>
  )
}

// Appointment Skeleton Component
function AppointmentSkeleton() {
  return (
    <div className="mb-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-3 border-b border-border/30">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-3">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex gap-4 mt-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Appointment Card Component
interface AppointmentCardProps {
  appointment: Appointment
  isHistory?: boolean
}

function AppointmentCard({ appointment, isHistory = false }: AppointmentCardProps) {
  const getStatusColor = (isHistory: boolean): string => {
    if (isHistory) return "bg-gray-100 text-gray-700"
    if (appointment.isCanceled) return "bg-red-100 text-red-700"
    return "bg-amber-100 text-amber-900"
  }

  const getStatusText = (isHistory: boolean, appointment: Appointment): string => {
    if (isHistory) return "Concluído"
    if (appointment.isCanceled) return "Cancelado"
    return "Agendado"
  }

  return (
    <motion.div {...fadeIn} className="mb-4">
      <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          {/* Cabeçalho com profissional */}
          <div className="p-4 flex items-center gap-3 border-b border-border/30">
            <Avatar className="h-10 w-10 rounded-full">
              <Image
                src={appointment.professionalImage || "https://via.placeholder.com/40"}
                alt={appointment.professionalName}
                width={40}
                height={40}
                className="object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{appointment.professionalName}</h3>
              <p className="text-xs text-muted-foreground">
                {appointment.professionalSpecialty || "Barbeiro Profissional"}
              </p>
            </div>
            <Badge className={cn("px-2 py-1 rounded-full text-xs font-normal", getStatusColor(isHistory))}>
              {getStatusText(isHistory, appointment)}
            </Badge>
          </div>

          {/* Detalhes do serviço */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-lg text-foreground">{appointment.serviceName}</h4>
                <p className="text-sm text-muted-foreground mt-1">{formatCurrency(appointment.price)}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {!isHistory && !appointment.isCanceled && (
                    <>
                      <DropdownMenuItem className="cursor-pointer">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Contatar barbeiro</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Remarcar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500 cursor-pointer">
                        <X className="h-4 w-4 mr-2" />
                        <span>Cancelar</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isHistory && (
                    <>
                      <DropdownMenuItem className="cursor-pointer">
                        <Star className="h-4 w-4 mr-2" />
                        <span>Avaliar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        <span>Reagendar mesmo serviço</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Data e hora */}
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="bg-accent/30 p-1.5 rounded">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{formatDateMask(appointment.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-accent/30 p-1.5 rounded">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{appointment.appointmentTime}</span>
              </div>
            </div>

            {/* Ações - mostradas para telas menores */}
            {!isHistory && !appointment.isCanceled && (
              <div className="flex gap-2 mt-4 md:hidden">
                <Button variant="outline" size="sm" className="text-xs h-9 w-full">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Contatar
                </Button>
                <Button variant="destructive" size="sm" className="text-xs h-9 w-full">
                  Cancelar
                </Button>
              </div>
            )}

            {isHistory && (
              <div className="flex gap-2 mt-4 md:hidden">
                <Button variant="outline" size="sm" className="text-xs h-9 w-full">
                  <Star className="h-3.5 w-3.5 mr-1.5" />
                  Avaliar
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-9 w-full">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Reagendar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Suggestion Card Component
interface SuggestionCardProps {
  suggestion: Suggestion
  onClick: () => void
}

function SuggestionCard({ suggestion, onClick }: SuggestionCardProps) {
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

// Appointment Tabs Component
interface AppointmentTabsProps {
  isPageLoading: boolean
  isLoading: boolean
  upcomingAppointments: Appointment[]
  historyAppointments: Appointment[]
  searchTerm: string
  filters: any
  onNewAppointment: () => void
}

function AppointmentTabs({
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

  // Filter appointments based on search and filters
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
            <div className="max-h-[calc(100vh-20vh)] overflow-y-auto pr-2">
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
            <div className="max-h-[calc(100vh-40vh)] overflow-y-auto pr-2">
              {filteredUpcoming.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}

              <Button
                variant="outline"
                className="w-full mt-4 py-6 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                onClick={onNewAppointment}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico" key="historico">
          {isPageLoading || isLoading ? (
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
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
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
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

// ===== MAIN PAGE COMPONENT =====
export default function AgendamentosPage() {
  const { status } = useSession()
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const { bookings, upcomingAppointments, historyAppointments, isLoading } = useBooking()

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

  // Calculate active filters count
  const activeFiltersCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0)

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
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-6 text-center">Faça login para visualizar seus agendamentos</h2>
          <LoginBtn />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="mb-6 mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie seus horários e descubra novos serviços</p>
          </div>
          <Button onClick={() => router.push("/agendament/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
        />

        {activeFiltersCount > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={handleResetFilters}>
              Limpar filtros
              <X className="ml-1 h-3 w-3" />
            </Button>

            {filters.status !== "all" && (
              <Badge variant="outline" className="rounded-md">
                Status:{" "}
                {filters.status === "scheduled"
                  ? "Agendado"
                  : filters.status === "canceled"
                    ? "Cancelado"
                    : "Concluído"}
              </Badge>
            )}

            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
              <Badge variant="outline" className="rounded-md">
                Preço: R${filters.priceRange[0]} - R${filters.priceRange[1]}
              </Badge>
            )}

            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="outline" className="rounded-md">
                Data: {filters.dateRange.from ? format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : ""}
                {filters.dateRange.from && filters.dateRange.to ? " - " : ""}
                {filters.dateRange.to ? format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : ""}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-6">
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

      <Footer />
    </div>
  )
}

