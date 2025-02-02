"use client"
import { useState } from "react"
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Smartphone, Wallet } from "lucide-react"
import useMercadoPago from "@/hooks/use-mercado-pago"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Service } from "@/app/page"


interface SelectPaymentMethodProps {
  closeDrawer: () => void
  selectServicesAPI: Service[] // Recebe os serviços selecionados
}

export const SelectPaymentMethod = ({ selectServicesAPI }: SelectPaymentMethodProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const { createMercadoPagoCheckout } = useMercadoPago()
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const paymentMethods = [
    { id: "app", name: "Pague pelo app", icon: <Smartphone className="w-6 h-6" /> },
    { id: "local", name: "Pague no local", icon: <Wallet className="w-6 h-6" /> },
  ]


  const handleConfirmPayment = async () => {
    if (selectedPaymentMethod === "app") {
      // Verifica se o selectServicesAPI é um array válido e contém dados
      if (!Array.isArray(selectServicesAPI) || selectServicesAPI.length === 0) {
        toast({
          title: "Erro no pagamento",
          description: "Nenhum serviço selecionado para o pagamento.",
          variant: "destructive",
        })
        return
      }
  
      try {
        // Gera a lista de itens com os serviços selecionados
        const checkoutResponse = await createMercadoPagoCheckout({
          testeId: session?.user?.id ?? "",
          userEmail: session?.user?.email ?? "",
          items: selectServicesAPI.map((service) => ({
            id: '1',
            name: service.name,
            description: `Serviço de ${service.name}`,
            price: Number(service.price),
          })),
        })
  
        // Agora a resposta tem o tipo correto e você pode acessar `initPoint`
        if (!checkoutResponse.initPoint) {
          throw new Error("Erro ao iniciar o checkout")
        }
  
        // Redireciona para o checkout do Mercado Pago
        router.push(checkoutResponse.initPoint)
      } catch (mpError) {
        console.error("Erro ao iniciar o checkout do Mercado Pago:", mpError)
        toast({
          title: "Erro no Pagamento",
          description: "Não foi possível iniciar o processo de pagamento. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    } else {
      // Lógica para pagamento local
      console.log("Pagamento no local")
    }
  }
  

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Selecione o Método de Pagamento</DrawerTitle>
        <DrawerDescription>Escolha a forma de pagamento que você deseja utilizar.</DrawerDescription>
      </DrawerHeader>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <Button
              key={method.id}
              variant={selectedPaymentMethod === method.id ? "default" : "outline"}
              className={`h-24 flex flex-col items-center justify-center transition-all ${
                selectedPaymentMethod === method.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedPaymentMethod(method.id)}
            >
              {method.icon}
              <span className="mt-2 text-sm">{method.name}</span>
            </Button>
          ))}
        </div>

        <Button
          variant="default"
          className="w-full mt-6"
          onClick={handleConfirmPayment}
          disabled={!selectedPaymentMethod}
        >
          Confirmar Pagamento
        </Button>
      </div>
    </DrawerContent>
  )
}
