"use client"
import { useEffect, useState } from "react"
import { SelectBarber } from "@/components/shared/select/select-barber"
import { SelectDate } from "@/components/shared/select/select-date"
import { SelectServices } from "@/components/shared/select/select-services"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import { Calendar, ChevronRight, Scissors, User, CreditCard, Loader2, Info, Check, ArrowLeft } from "lucide-react"
import { formatDateString } from "@/utils/date-object"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useBooking } from "@/hooks/useAgendament"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PhoneVerificationModal } from "../utils/phone-verification/phone-verification-modal"

export interface Service {
  name: string | boolean
  id: string | boolean
  price: string
}

interface Professional {
  name: string
  id: string
  image: string
  specialty: string
}

interface DateTimeSelection {
  date: string
  time: string
}

export default function NovoAgendamentoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [isDrawerOpenServices, setIsDrawerOpenServices] = useState<boolean>(false)
  const { toast } = useToast()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const { createBooking, isSubmitting } = useBooking()
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState<boolean>(false)

  const [selectProfessional, setSelectedProfessional] = useState<Professional>({
    name: "Selecione o profissional",
    id: "",
    image: "",
    specialty: "",
  })

  const [selectServicesAPI, setSelectedServiceAPI] = useState<
    Array<{
      name: string
      id: string
      price: string
    }>
  >([
    {
      name: "Selecione o serviço",
      id: "",
      price: "0",
    },
  ])

  const [selectedDateTime, setSelectedDateTime] = useState<DateTimeSelection>({
    date: "",
    time: "",
  })
  const [isLoadingProfessional, setIsLoadingProfessional] = useState<boolean>(false)
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false)
  const [isLoadingDate, setIsLoadingDate] = useState<boolean>(false)
  useEffect(() => {
    if (!selectedPaymentMethod) {
      setSelectedPaymentMethod("Pagamento no local")
    }
  }, [selectedPaymentMethod])

  const handleSelectProfessional = async (
    name: string,
    id: string,
    image: string,
    specialty: string,
  ): Promise<void> => {
    setIsLoadingProfessional(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSelectedProfessional({ name, id, image, specialty })
    setIsDrawerOpen(false)
    setIsLoadingProfessional(false)
  }

  const handleSelectServices = async (name: string, id: string, price: string): Promise<void> => {
    setIsLoadingServices(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSelectedServiceAPI([{ name, id, price }])
    setIsDrawerOpenServices(false)
    setIsLoadingServices(false)
  }

  const handleDateSelect = async (date: Date, time: string): Promise<void> => {
    setIsLoadingDate(true)
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSelectedDateTime({ date: formattedDate, time })
    setIsLoadingDate(false)
  }

  const closeDrawer = (): void => setIsDrawerOpen(false)
  const closeDrawerServices = (): void => setIsDrawerOpenServices(false)

  const isButtonDisabled: boolean =
    !selectProfessional.id ||
    selectServicesAPI[0].id === "" ||
    !selectedDateTime.date ||
    !selectedDateTime.time ||
    !selectedPaymentMethod ||
    status !== "authenticated" ||
    isSubmitting

  const handleSubmit = async (): Promise<void> => {
    if (isButtonDisabled) {
      if (status !== "authenticated") {
        toast({
          title: "Erro!",
          description: "Você precisa estar logado para fazer um agendamento.",
          variant: "destructive",
        })
        return
      }
      return
    }

    if (
      !session?.user?.id ||
      !selectProfessional.id ||
      !selectServicesAPI[0].id ||
      !selectedDateTime.date ||
      !selectedDateTime.time
    ) {
      toast({
        title: "Erro no agendamento",
        description: "Todos os campos são obrigatórios para criar um agendamento.",
        variant: "destructive",
      })
      return
    }

    // Verificar se o usuário tem um número de telefone
    if (!session.user.phone) {
      // Abrir o modal de verificação de telefone em vez de enviar o agendamento
      setIsPhoneModalOpen(true)
      toast({
        title: "Telefone necessário",
        description: "Você precisa vincular um número de telefone à sua conta antes de agendar.",
        variant: "destructive",
      })
      return
    }

    const result = await createBooking({
      userId: Number(session?.user?.id),
      professionalId: Number(selectProfessional.id),
      serviceId: selectServicesAPI[0].id,
      appointmentDate: selectedDateTime.date,
      appointmentTime: selectedDateTime.time,
      paymentMethod: "Pagamento no local",
    })

    if (result.success) {
      router.push("/")
    }
  }

  return (
    <div className="flex flex-col">
      <div className="p-3.5 flex flex-row gap-2 items-center">
        <Button variant="ghost" size="sm" className="mr-2 h-8 w-8 p-0" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Novo Agendamento</h1>
      </div>

      <Card className="">
        <CardContent className="p-6">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Seleção de profissional */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-foreground flex items-center">
                    <User className="h-4 w-4 mr-2 opacity-70" />
                    Profissional
                  </label>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded flex items-center gap-1",
                      selectProfessional.id
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {selectProfessional.id ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Selecionado</span>
                      </>
                    ) : (
                      "Pendente"
                    )}
                  </span>
                </div>

                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-between w-full", selectProfessional.id && "border-white/50")}
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <User className="w-5 h-5" />
                        <span className="truncate">{selectProfessional.name}</span>
                      </div>
                      {isLoadingProfessional ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </Button>
                  </DrawerTrigger>
                  <SelectBarber setSelectedProfessional={handleSelectProfessional} closeDrawer={closeDrawer} />
                </Drawer>
              </div>

              {/* Seleção de serviço */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-foreground flex items-center">
                    <Scissors className="h-4 w-4 mr-2 opacity-70" />
                    Serviço
                  </label>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded flex items-center gap-1",
                      selectServicesAPI[0].id
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {selectServicesAPI[0].id ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Selecionado</span>
                      </>
                    ) : (
                      "Pendente"
                    )}
                  </span>
                </div>

                <Drawer open={isDrawerOpenServices} onOpenChange={setIsDrawerOpenServices}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-between w-full", selectServicesAPI[0].id && "border-white/50")}
                      onClick={() => setIsDrawerOpenServices(true)}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Scissors className="w-5 h-5" />
                        <span className="truncate">
                          {selectServicesAPI[0].id ? selectServicesAPI[0].name : "Escolher Serviços"}
                        </span>
                      </div>
                      {isLoadingServices ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </Button>
                  </DrawerTrigger>
                  <SelectServices setSelectedServicesAPI={handleSelectServices} closeDrawer={closeDrawerServices} />
                </Drawer>
              </div>

              {/* Seleção de data e hora */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-2 opacity-70" />
                    Data e Hora
                  </label>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded flex items-center gap-1",
                      selectedDateTime.date && selectedDateTime.time
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {selectedDateTime.date && selectedDateTime.time ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Selecionado</span>
                      </>
                    ) : (
                      "Pendente"
                    )}
                  </span>
                </div>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-between w-full",
                        selectedDateTime.date && selectedDateTime.time && "border-white/50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        <span className="truncate">
                          {selectedDateTime.time ? (
                            <>
                              {formatDateString(selectedDateTime.date)} às {selectedDateTime.time}
                            </>
                          ) : (
                            "Selecione data e hora"
                          )}
                        </span>
                      </div>
                      {isLoadingDate ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </Button>
                  </DrawerTrigger>
                  <SelectDate onDateSelect={handleDateSelect} />
                </Drawer>
              </div>

              {/* Método de pagamento (fixo: apenas no local) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-foreground flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 opacity-70" />
                    Método de Pagamento
                  </label>
                  <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1 bg-primary/10 text-primary border border-primary/30">
                    <Check className="h-3 w-3" />
                    <span>Pagamento no local</span>
                  </span>
                </div>

                <Button variant="outline" className="justify-between w-full cursor-default border-white/50" disabled>
                  <div className="flex items-center justify-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span className="truncate">Pagamento no local</span>
                  </div>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="px-6.5 ">
          {!session && status !== "loading" && (
            <div className="w-full mb-4 bg-amber-500/10 border border-amber-500/30 rounded-md p-3 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-500 font-medium">Faça login para continuar</p>
                <p className="text-xs text-amber-500/80 mt-1">Você precisa estar logado para confirmar o agendamento</p>
              </div>
            </div>
          )}

          <Button variant="default" className="w-full font-medium" disabled={isButtonDisabled} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin " />
                Processando...
              </>
            ) : (
              "Confirmar Agendamento"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de verificação de telefone */}
      <PhoneVerificationModal
        open={isPhoneModalOpen}
        onOpenChange={setIsPhoneModalOpen}
        onSuccess={() => {
          // Após a verificação bem-sucedida, tente enviar o agendamento novamente
          handleSubmit()
        }}
      />
    </div>
  )
}

