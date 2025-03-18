"use client"

import { useState } from "react"
import { AlertTriangle, Loader2, CheckCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useBooking } from "@/hooks/useAgendament"


interface CancelAppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: number
  appointmentName: string
}

export function CancelAppointmentDialog({
  isOpen,
  onClose,
  appointmentId,
  appointmentName,
}: CancelAppointmentDialogProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const { cancelBooking } = useBooking()

  const handleCancel = async () => {
    try {
      setStatus("loading")
      const result = await cancelBooking(appointmentId)
      
      if (result.success) {
        setStatus("success")
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error)
      setStatus("error")
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && status !== "loading" && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          {status === "success" ? (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          ) : status === "error" ? (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          ) : (
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          )}
          
          <AlertDialogTitle className="mt-4 text-center">
            {status === "success" 
              ? "Agendamento cancelado" 
              : status === "error" 
                ? "Erro ao cancelar" 
                : "Cancelar agendamento"}
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-center">
            {status === "success" 
              ? "Seu agendamento foi cancelado com sucesso." 
              : status === "error" 
                ? "Ocorreu um erro ao tentar cancelar seu agendamento. Por favor, tente novamente."
                : `Tem certeza que deseja cancelar o agendamento "${appointmentName}"? Esta ação não pode ser desfeita.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0 w-full">
          {status === "idle" && (
            <>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCancel} 

                className="bg-destructive hover:bg-destructive/90 text-secondary"
              >

                Confirmar cancelamento
              </AlertDialogAction>
            </>
          )}
          
          {status === "loading" && (
            <AlertDialogAction disabled className="w-full sm:w-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </AlertDialogAction>
          )}
          
          {(status === "success" || status === "error") && (
            <AlertDialogAction onClick={onClose}>Fechar</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}