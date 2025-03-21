"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { BookingService, type BookingResponse, type BookingParams } from "@/services/bookingService"

// Custom fetcher function for SWR that handles userId as number
const bookingFetcher = async ([url, token, userId]: [string, string, number]) => {
  return await BookingService.getBookingsByUserId(userId, token)
}

export const useBooking = () => {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Ensure userId is treated as a number
  const userId = session?.user?.id as number | undefined
  const token = session?.accessToken as string

  // Fetch dos agendamentos do usuário atual
  const { data, error, isLoading, mutate } = useSWR(
    userId && token ? [`/api/agendaments/user/${userId}`, token, userId] : null,
    bookingFetcher,
    {
      onError: (error) => {
        console.error("Erro ao buscar agendamentos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus agendamentos.",
          variant: "destructive",
        })
      },
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 seconds
    }
  )

  // Separar os agendamentos em próximos e histórico
  const upcomingAppointments = useMemo(() => {
    if (!data) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return data
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate)
        appointmentDate.setHours(0, 0, 0, 0)
        return !appointment.isCanceled && appointment.status !== "completed" && appointmentDate >= today
      })
      .sort((a, b) => {
        // Ordenar por data mais próxima primeiro
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`)
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`)
        return dateA.getTime() - dateB.getTime()
      })
  }, [data])

  const historyAppointments = useMemo(() => {
    if (!data) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return data
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate)
        appointmentDate.setHours(0, 0, 0, 0)
        return appointment.isCanceled || appointment.status === "completed" || appointmentDate < today
      })
      .sort((a, b) => {
        // Ordenar por data mais recente primeiro
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`)
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`)
        return dateB.getTime() - dateA.getTime()
      })
  }, [data])

  // Implementação da função createBooking
  const createBooking = async (
    bookingData: BookingParams,
  ): Promise<{ success: boolean; data?: BookingResponse; error?: unknown }> => {
    if (!token) {
      toast({
        title: "Erro!",
        description: "Você precisa estar logado para fazer um agendamento.",
        variant: "destructive",
      })
      return { success: false }
    }

    setIsSubmitting(true)

    try {
      const result = await BookingService.createBooking(bookingData, token)

      toast({
        title: "Agendamento confirmado!",
        description: "Seu horário foi agendado com sucesso.",
        variant: "default",
      })

      // Revalidate the booking list after creating a new booking
      await mutate()

      return { success: true, data: result }
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error)
      toast({
        title: "Erro no agendamento",
        description: "Ocorreu um erro ao confirmar. Tente novamente.",
        variant: "destructive",
      })
      return { success: false, error }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Implementação da função cancelBooking
  const cancelBooking = async (id: number): Promise<{ success: boolean; error?: unknown }> => {
    if (!token) {
      toast({
        title: "Erro!",
        description: "Você precisa estar logado para cancelar um agendamento.",
        variant: "destructive",
      })
      return { success: false }
    }

    setIsSubmitting(true)

    try {
      await BookingService.cancelBooking(id, token)

      toast({
        title: "Agendamento cancelado!",
        description: "Seu horário foi cancelado com sucesso.",
        variant: "default",
      })

      // Revalidate the bookings
      await mutate()

      return { success: true }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error)
      toast({
        title: "Erro no cancelamento",
        description: "Ocorreu um erro ao cancelar. Tente novamente.",
        variant: "destructive",
      })
      return { success: false, error }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    bookings: data,
    upcomingAppointments,
    historyAppointments,
    isLoading,
    error,
    isSubmitting,
    createBooking,
    cancelBooking,
    refreshBookings: mutate,
  }
}
