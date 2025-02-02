"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface PixModalProps {
  isOpen: boolean
  onClose: () => void
  qrCodeUrl: string
  paymentId: string
}

export function PixModal({ isOpen, onClose, qrCodeUrl, paymentId }: PixModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      checkPaymentStatus(paymentId)
    }
  }, [isOpen, paymentId])

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/check-payment-status?payment_id=${paymentId}`)
      const data = await response.json()

      if (data.isApproved) {
        toast({
          title: "Pagamento aprovado",
          description: "Seu pagamento foi processado com sucesso!",
          variant: "default",
        })
        onClose()
      } else if (data.status === "pending") {
        setTimeout(() => checkPaymentStatus(paymentId), 5000)
      } else {
        toast({
          title: "Erro no pagamento",
          description: "Houve um problema com seu pagamento. Por favor, tente novamente.",
          variant: "destructive",
        })
        onClose()
      }
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error)
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status do pagamento. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <Image src={qrCodeUrl || "/placeholder.svg"} alt="QR Code PIX" width={200} height={200} />
              <p className="text-sm text-center">
                Escaneie o QR Code acima com o aplicativo do seu banco para realizar o pagamento via PIX.
              </p>
              <Button onClick={() => checkPaymentStatus(paymentId)}>Verificar Pagamento</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}