"use client";
import { useEffect, useState } from "react";
import { SelectBarber } from "@/components/shared/select/select-barber";
import { SelectDate } from "@/components/shared/select/select-date";
import { SelectServices } from "@/components/shared/select/select-services";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import {
  Calendar,
  ChevronRight,
  Scissors,
  User,
  CreditCard,
  Loader2,
  Info,
  Check,
} from "lucide-react";

import axios from "axios";
import { formatDateString } from "@/utils/date-object";
import { LoginBtn } from "@/components/shared/login/login";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/shared/footer/footer";
import { useToast } from "@/hooks/use-toast";

import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CarouselBarbershop } from "@/components/carousel/carousel";


export interface Service {
  name: string | boolean;
  id: string | boolean;
  price: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenServices, setIsDrawerOpenServices] = useState(false);

  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // State para rastrear a etapa atual (1 a 4)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectProfessional, setSelectedProfessional] = useState({
    name: "Selecione o profissional",
    id: "",
    image: "",
    specialty: "",
  });

  const [selectServicesAPI, setSelectedServiceAPI] = useState([
    {
      name: "Selecione o serviço",
      id: "",
      price: "0",
    },
  ]);
  
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: string;
    time: string;
  }>({
    date: "",
    time: "",
  });

  const [isLoadingProfessional, setIsLoadingProfessional] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingDate, setIsLoadingDate] = useState(false);

  // Atualizar a etapa atual com base nas seleções
  useEffect(() => {
    // Calcular etapas completas corretamente, independente da ordem
    let completedSteps = 0;
    
    if (selectProfessional.id) completedSteps++;
    if (selectServicesAPI[0].id) completedSteps++;
    if (selectedDateTime.date && selectedDateTime.time) completedSteps++;
    if (selectedPaymentMethod) completedSteps++;
    
    setCurrentStep(completedSteps);
    
    // Isso não depende mais da ordem de seleção
  }, [selectProfessional, selectServicesAPI, selectedDateTime, selectedPaymentMethod]);

  // Definir método de pagamento automaticamente como "Pagamento no local"
  useEffect(() => {
    if (!selectedPaymentMethod) {
      setSelectedPaymentMethod("Pagamento no local");
    }
  }, [selectedPaymentMethod]);

  const handleSelectProfessional = async (
    name: string,
    id: string,
    image: string,
    specialty: string
  ) => {
    setIsLoadingProfessional(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSelectedProfessional({ name, id, image, specialty });
    setIsDrawerOpen(false);
    setIsLoadingProfessional(false);
  };

  const handleSelectServices = async (
    name: string,
    id: string,
    price: string
  ) => {
    setIsLoadingServices(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSelectedServiceAPI([{ name, id, price }]);
    setIsDrawerOpenServices(false);
    setIsLoadingServices(false);
  };

  const handleDateSelect = async (date: Date, time: string) => {
    setIsLoadingDate(true);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSelectedDateTime({ date: formattedDate, time });
    setIsLoadingDate(false);
  };



  const closeDrawer = () => setIsDrawerOpen(false);
  const closeDrawerServices = () => setIsDrawerOpenServices(false);


  const isButtonDisabled =
    !selectProfessional.id ||
    selectServicesAPI[0].id === "" ||
    !selectedDateTime.date ||
    !selectedDateTime.time ||
    !selectedPaymentMethod ||
    status !== "authenticated" ||
    isSubmitting;

  const handleSubmit = async () => {
    if (isButtonDisabled) {
      if (status !== "authenticated") {
        toast({
          title: "Erro!",
          description: "Você precisa estar logado para fazer um agendamento.",
          variant: "destructive",
        });
        return;
      }
      
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Erro!",
        description:
          "Não foi possível identificar o usuário. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Aqui você adicionaria a lógica para finalizar o agendamento
    try {
      // Exemplo de chamada para API para confirmar o agendamento
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/agendament`, {
        userId: session.user.id,
        barberId: selectProfessional.id,
        service: selectServicesAPI[0].name,
        date: selectedDateTime.date,
        time: selectedDateTime.time,
        paymentMethod: "Pagamento no local" // Sempre definido como pagamento no local
      });
      
      toast({
        title: "Agendamento confirmado!",
        description: "Seu horário foi agendado com sucesso.",
        variant: "default",
      });
      
      // Resetar formulário
      setSelectedProfessional({
        name: "Selecione o profissional",
        id: "",
        image: "",
        specialty: "",
      });
      setSelectedServiceAPI([{
        name: "Selecione o serviço",
        id: "",
        price: "0",
      }]);
      setSelectedDateTime({ date: "", time: "" });
      setSelectedPaymentMethod("");
      
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      toast({
        title: "Erro no agendamento",
        description: "Ocorreu um erro ao confirmar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
   

      

        <Card className="w-full max-w-md border-border shadow-lg">
        <CarouselBarbershop />
          {/* Indicador de etapas */}
          <div className="flex items-center justify-between px-6 py-2 border-b">
  <span className="text-sm font-medium text-accent-foreground">Etapas do agendamento {currentStep}/4</span>
  <div className="flex gap-1">
    <div className={cn("h-1.5 w-8 rounded-full", selectProfessional.id ? "bg-primary" : "bg-muted")}></div>
    <div className={cn("h-1.5 w-8 rounded-full", selectServicesAPI[0].id ? "bg-primary" : "bg-muted")}></div>
    <div className={cn("h-1.5 w-8 rounded-full", selectedDateTime.date && selectedDateTime.time ? "bg-primary" : "bg-muted")}></div>
    <div className={cn("h-1.5 w-8 rounded-full", selectedPaymentMethod ? "bg-primary" : "bg-muted")}></div>
  </div>
</div>
          
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
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded flex items-center gap-1",
                      selectProfessional.id 
                        ? "bg-primary/10 text-primary border border-primary/30" 
                        : "bg-muted text-muted-foreground"
                    )}>
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
                        className={cn(
                          "justify-between w-full",
                          selectProfessional.id && "border-white/50"
                        )}
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
                    <SelectBarber
                      setSelectedProfessional={handleSelectProfessional}
                      closeDrawer={closeDrawer}
                    />
                  </Drawer>
                </div>

                {/* Seleção de serviço */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground flex items-center">
                      <Scissors className="h-4 w-4 mr-2 opacity-70" />
                      Serviço
                    </label>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded flex items-center gap-1",
                      selectServicesAPI[0].id 
                        ? "bg-primary/10 text-primary border border-primary/30" 
                        : "bg-muted text-muted-foreground"
                    )}>
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
                  
                  <Drawer
                    open={isDrawerOpenServices}
                    onOpenChange={setIsDrawerOpenServices}
                  >
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-between w-full",
                          selectServicesAPI[0].id &&  "border-white/50"
                        )}
                        onClick={() => setIsDrawerOpenServices(true)}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Scissors className="w-5 h-5" />
                          <span className="truncate">
                            {selectServicesAPI[0].id
                              ? selectServicesAPI[0].name
                              : "Escolher Serviços"}
                          </span>
                        </div>
                        {isLoadingServices ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </Button>
                    </DrawerTrigger>
                    <SelectServices
                      setSelectedServicesAPI={handleSelectServices}
                      closeDrawer={closeDrawerServices}
                    />
                  </Drawer>
                </div>

                {/* Seleção de data e hora */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2 opacity-70" />
                      Data e Hora
                    </label>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded flex items-center gap-1",
                      selectedDateTime.date && selectedDateTime.time
                        ? "bg-primary/10 text-primary border border-primary/30" 
                        : "bg-muted text-muted-foreground"
                    )}>
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
                          selectedDateTime.date && selectedDateTime.time &&  "border-white/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5" />
                          <span className="truncate">
                            {selectedDateTime.time ? (
                              <>
                                {formatDateString(selectedDateTime.date)} às{" "}
                                {selectedDateTime.time}
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
                  
                  <Button
                    variant="outline"
                    className="justify-between w-full cursor-default border-white/50"
                    disabled
                  >
                    <div className="flex items-center justify-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <span className="truncate">Pagamento no local</span>
                    </div>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="px-6 py-4 border-t">
            {!session && status !== "loading" && (
              <div className="w-full mb-4 bg-amber-500/10 border border-amber-500/30 rounded-md p-3 flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-500 font-medium">Faça login para continuar</p>
                  <p className="text-xs text-amber-500/80 mt-1">
                    Você precisa estar logado para confirmar o agendamento
                  </p>
                </div>
              </div>
            )}
            
            <Button
              variant="default"
              className="w-full font-medium"
              disabled={isButtonDisabled}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                "Confirmar Agendamento"
              )}
            </Button>
          </CardFooter>
        </Card>
      
      <LoginBtn />
      <Footer />
    </div>
  );
}