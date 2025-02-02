"use client"
import { useState } from "react"
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Smartphone } from 'lucide-react'
import useMercadoPago from "@/hooks/use-mercado-pago"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Service } from "@/app/page"
import { PixModal } from "./pix-modal"


interface SelectPaymentMethodProps {
  closeDrawer: () => void
  selectServicesAPI: Service[]
}

export const SelectPaymentMethod = ({ selectServicesAPI, closeDrawer }: SelectPaymentMethodProps) => {
  const [isPixModalOpen, setIsPixModalOpen] = useState(false)
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState("")
  const [pixPaymentId, setPixPaymentId] = useState("")
  const { createMercadoPagoCheckout } = useMercadoPago()
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleConfirmPayment = async () => {
    if (!Array.isArray(selectServicesAPI) || selectServicesAPI.length === 0) {
      toast({
        title: "Erro no pagamento",
        description: "Nenhum serviço selecionado para o pagamento.",
        variant: "destructive",
      })
      return
    }

    try {
      const checkoutResponse = await createMercadoPagoCheckout({
        testeId: session?.user?.id ?? "",
        userEmail: session?.user?.email ?? "",
        items: selectServicesAPI.map((service) => ({
          id: "1",
          name: service.name,
          description: `Serviço de ${service.name}`,
          price: Number(service.price),
        })),
        paymentMethods: {
          pix: {
            expirationDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos de expiração
          },
        },
      })

      if (!checkoutResponse.pixQrCode || !checkoutResponse.paymentId) {
        throw new Error("Erro ao gerar o QR Code do PIX")
      }

      setPixQrCodeUrl(checkoutResponse.pixQrCode)
      setPixPaymentId(checkoutResponse.paymentId)
      setIsPixModalOpen(true)
      closeDrawer()
    } catch (error) {
      console.error("Erro ao iniciar o checkout do Mercado Pago:", error)
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível iniciar o processo de pagamento. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pagamento via PIX</DrawerTitle>
          <DrawerDescription>Clique no botão abaixo para gerar um QR Code PIX para pagamento.</DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <Button
            variant="default"
            className="w-full"
            onClick={handleConfirmPayment}
          >
            <Smartphone className="w-6 h-6 mr-2" />
            Gerar QR Code PIX
          </Button>
        </div>
      </DrawerContent>

      <PixModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        qrCodeUrl={pixQrCodeUrl}
        paymentId={pixPaymentId}
      />
    </>
  )
}