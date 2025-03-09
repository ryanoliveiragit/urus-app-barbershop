"use client"
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { MapPin } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Service } from "@/app/page"

interface SelectPaymentMethodProps {
  closeDrawer: () => void
  selectServicesAPI: Service[]
  onSelectMethod: (method: string) => void
}

export const SelectPaymentMethod = ({ 
  selectServicesAPI, 
  closeDrawer,
  onSelectMethod 
}: SelectPaymentMethodProps) => {
  const { toast } = useToast()

  const handlePaymentInPerson = () => {
    if (!Array.isArray(selectServicesAPI) || selectServicesAPI.length === 0 || !selectServicesAPI[0].id) {
      toast({
        title: "Erro no agendamento",
        description: "Nenhum serviço selecionado para o agendamento.",
        variant: "destructive",
      })
      return
    }

    // Notificar o componente pai sobre o método de pagamento selecionado
    onSelectMethod("Pagamento no local")
    closeDrawer()
  }

  const totalAmount = Array.isArray(selectServicesAPI) && selectServicesAPI.length > 0
    ? selectServicesAPI.reduce((total, service) => total + (parseFloat(service.price as string) || 0), 0)
    : 0

  return (
    <DrawerContent className="bg-[#1c1c1c] text-white">
      <DrawerHeader className="border-b border-gray-800">
        <DrawerTitle className="text-white">Método de Pagamento</DrawerTitle>
        <DrawerDescription className="text-gray-400">
          O pagamento será realizado no local
        </DrawerDescription>
      </DrawerHeader>

      <div className="px-4 py-6">
        {totalAmount > 0 && (
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-400">Valor total</p>
            <p className="text-2xl font-bold text-yellow-500">
              {totalAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
        )}

        <div className="border border-gray-800 rounded-md p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pagamento no local</h3>
              <p className="text-sm text-gray-400 mt-1">
                Realize o pagamento diretamente na barbearia
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 text-center mb-4">
          Outros métodos de pagamento estarão disponíveis em breve
        </p>
      </div>

      <DrawerFooter className="border-t border-gray-800 pt-4">
        <Button 
          onClick={handlePaymentInPerson}
          className="w-full font-medium bg-gray-800 hover:bg-gray-700 text-white"
        >
          Confirmar Pagamento no Local
        </Button>
        <Button variant="outline" onClick={closeDrawer} className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
          Cancelar
        </Button>
      </DrawerFooter>
    </DrawerContent>
  )
}