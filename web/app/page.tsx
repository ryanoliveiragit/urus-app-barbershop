"use client";
import { useEffect, useState } from "react";
import { Layout } from "@/components/shared/layout";
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
} from "lucide-react";
import Image from "next/image";
import imgHeadere from "../public/urus.jpeg";
import imgLogo from "../public/logo_barbosa.svg";
import axios from "axios";
import { formatDateString } from "@/utils/date-object";
import { LoginBtn } from "@/components/shared/login/login";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/shared/footer/footer";
import { useToast } from "@/hooks/use-toast";
import { SelectPaymentMethod } from "@/components/shared/select/select-payment-type";
import useUserOrders from "@/hooks/use-orders";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Service {
  name: string | boolean;
  id: string | boolean;
  price: string;
}


export default function Home() {
  const { data: session, status } = useSession();
  const [isApproved, setIsApproved] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenServices, setIsDrawerOpenServices] = useState(false);
  const [isDrawerOpenPayment, setIsDrawerOpenPayment] = useState(false);

  const { orders, lastOrderId } = useUserOrders(session?.user?.id || "");
  const { toast } = useToast();
  const [paidService, setPaidService] = useState("");

  const [hasCheckedPayment, setHasCheckedPayment] = useState(false);

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

  useEffect(() => {
    if (status === "loading" || hasCheckedPayment) return;
    if (!session?.user?.id) return;

    console.log("lastOrderId", lastOrderId);
    const params = new URLSearchParams(window.location.search);
    const paymentIdFromUrl = params.get("payment_id");

    // Função para verificar e atualizar o pagamento
    const checkAndUpdatePayment = async (paymentId: string) => {
      try {
        const paymentResponse = await fetch(
          `/api/check-payment?payment_id=${paymentId}`
        );
        const paymentData = await paymentResponse.json();

        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (paymentData.status === "approved") {
          setIsApproved(true);
          setPaidService("Serviço pago");
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          toast({
            title: "Pagamento aprovado!",
            description: "Seu pagamento foi aprovado com sucesso!",
            variant: "default",
          });

          // Atualize a ordem com o ID correto
          if (orders.length > 0) {
            const firstOrder = orders[0];
            try {
              await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                id: firstOrder.id,
                paymentId: paymentId,
                userId: session.user.id,
              });
            } catch (error) {
              console.error("Erro ao atualizar pedido:", error);
              toast({
                title: "Erro na atualização do pedido",
                description: "Ocorreu um erro ao atualizar o pagamento.",
                variant: "destructive",
              });
            }
          }
        } else {
          toast({
            title: "Redirecionando para o pagamento",
            description:
              "Você será redirecionado para o checkout de pagamento, aguarde!",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
        toast({
          title: "Redirecionando para o pagamento",
          description:
            "Você será redirecionado para o checkout de pagamento, aguarde!",
          variant: "default",
        });
      }
    };

    if (paymentIdFromUrl) {
      checkAndUpdatePayment(paymentIdFromUrl);
    } else {

      if (orders.length > 0) {
        const firstOrder = orders[0];
      if (firstOrder) {
        console.log("ordem do backend", firstOrder.paymentId)
        checkAndUpdatePayment(firstOrder.paymentId);
      } else {
        console.log("nenhuma o ordem encontrada")
        setHasCheckedPayment(true);
      }
      }
      
    }
  }, [session?.user?.id, status, orders, hasCheckedPayment, toast]); // Remova a dependência de 'lastOrderId' e adicione outras necessárias

  const handleSelectProfessional = async (
    name: string,
    id: string,
    image: string,
    specialty: string
  ) => {
    setIsLoadingProfessional(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSelectedProfessional({ name, id, image, specialty });
    setIsDrawerOpen(false);
    setIsLoadingProfessional(false);
    setTimeout(() => {
      toast({
        title: "Profissional selecionado",
        description: `Você escolheu ${name} como seu profissional.`,
        variant: "default",
      });
    }, 3000);
  };

  const handleSelectServices = async (
    name: string,
    id: string,
    price: string
  ) => {
    setIsLoadingServices(true);
    setSelectedServiceAPI([{ name, id, price }]);
    setIsDrawerOpenServices(false);
    setIsLoadingServices(false);
    setTimeout(() => {
      toast({
        title: "Serviço selecionado",
        description: `Você escolheu ${name} por R$ ${price}.`,
        variant: "default",
      });
    }, 3000);
  };

  const handleDateSelect = async (date: Date, time: string) => {
    setIsLoadingDate(true);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSelectedDateTime({ date: formattedDate, time });
    setIsLoadingDate(false);
    setTimeout(() => {
      toast({
        title: "Data e hora selecionadas",
        description: `Agendado para ${formatDateString(
          formattedDate
        )} às ${time}.`,
        variant: "default",
      });
    }, 3000);
  };

  const closeDrawer = () => setIsDrawerOpen(false);
  const closeDrawerServices = () => setIsDrawerOpenServices(false);

  const isButtonDisabled =
    !selectProfessional.id ||
    selectServicesAPI.length === 0 ||
    !selectedDateTime.date ||
    !selectedDateTime.time ||
    status !== "authenticated";

  const handleSubmit = async () => {
    if (isButtonDisabled) {
      if (status !== "authenticated") {
        setTimeout(() => {
          toast({
            title: "Erro!",
            description: "Você precisa estar logado para fazer um agendamento.",
            variant: "destructive",
          });
        }, 3000);
        return;
      }
      return;
    }

    if (!session?.user?.id) {
      setTimeout(() => {
        toast({
          title: "Erro!",
          description:
            "Não foi possível identificar o usuário. Por favor, faça login novamente.",
          variant: "destructive",
        });
      }, 3000);
      return;
    }

 
  };

  return (
    <div className="flex flex-col relative h-screen bg-gradient-to-t from-black to-transparent">
      <header className="absolute -z-10 -top-10">
        <Image
          src={imgHeadere || "/placeholder.svg"}
          width={800}
          height={500}
          alt="Imagem de cabeçalho"
          className="object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </header>
      <section>
        <Image
          src={imgLogo || "/placeholder.svg"}
          width={250}
          height={400}
          alt="Logo"
          className="absolute left-[4rem] -top-10 invert brightness-0"
        />
      </section>
      <Layout>
        <AnimatePresence>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 mt-[8rem]"
          >
            <section className="text-md text-center flex-col flex gap-3">
              <h1 className="text-2xl font-semibold">Agende seu horário</h1>
              <p className="text-[#D4D4D4] font-medium text-[14px]">
                Escolha os serviços que desejar e agende no horário que preferir
              </p>
            </section>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button
                        variant="secondary"
                        className="justify-between"
                        onClick={() => setIsDrawerOpen(true)}
                      >
                        <div className="flex items-center justify-center gap-3">
                          {selectProfessional.image ? (
                            <Image
                              src={
                                selectProfessional.image || "/placeholder.svg"
                              }
                              alt="Foto do barbeiro"
                              width={40}
                              height={40}
                              className="rounded-full object-cover h-10"
                            />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                          <span>{selectProfessional.name}</span>
                        </div>
                        {isLoadingProfessional ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <ChevronRight className="w-6 h-6" />
                        )}
                      </Button>
                    </DrawerTrigger>
                    <SelectBarber
                      setSelectedProfessional={handleSelectProfessional}
                      closeDrawer={closeDrawer}
                    />
                  </Drawer>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Selecione o profissional</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Drawer
                    open={isDrawerOpenServices}
                    onOpenChange={setIsDrawerOpenServices}
                  >
                    <DrawerTrigger asChild>
                      <Button
                        variant="secondary"
                        className="justify-between"
                        onClick={() => setIsDrawerOpenServices(true)}
                        disabled={isApproved}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Scissors className="w-6 h-6" />
                          <span>
                            {isApproved
                              ? paidService
                              : selectServicesAPI.length > 0
                              ? selectServicesAPI
                                  .map((service) => service.name)
                                  .join(", ")
                              : "Escolher Serviços"}
                          </span>
                        </div>
                        {isLoadingServices ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <ChevronRight className="w-6 h-6" />
                        )}
                      </Button>
                    </DrawerTrigger>
                    <SelectServices
                      setSelectedServicesAPI={handleSelectServices}
                      closeDrawer={closeDrawerServices}
                    />
                  </Drawer>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Escolha os serviços desejados</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="secondary" className="justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-6 h-6" />
                          <span>
                            {selectedDateTime.time ? (
                              <>
                                {formatDateString(selectedDateTime.date)} às{" "}
                                {selectedDateTime.time} hrs
                              </>
                            ) : (
                              "Selecione data e hora"
                            )}
                          </span>
                        </div>
                        {isLoadingDate ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <ChevronRight className="w-6 h-6" />
                        )}
                      </Button>
                    </DrawerTrigger>
                    <SelectDate onDateSelect={handleDateSelect} />
                  </Drawer>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Escolha a data e hora do agendamento</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Drawer
                    open={isDrawerOpenPayment}
                    onOpenChange={setIsDrawerOpenPayment}
                  >
                    <DrawerTrigger asChild>
                      <Button
                        disabled={isApproved}
                        variant="secondary"
                        className="justify-between"
                        onClick={() => setIsDrawerOpenPayment(true)}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <CreditCard className="w-6 h-6" />
                          <span>
                            {isApproved ? (
                              <>Pago pelo app</>
                            ) : (
                              "Selecionar metodo de pagamento"
                            )}
                          </span>
                        </div>
                       
                       <ChevronRight className="w-6 h-6" />
                      </Button>
                    </DrawerTrigger>
                    <SelectPaymentMethod
                      selectServicesAPI={selectServicesAPI}
                      closeDrawer={() => setIsDrawerOpenPayment(false)}
                    />
                  </Drawer>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Escolha o método de pagamento</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className="text-md font-semibold"
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                  >
                    Confirmar Agendamento
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clique para confirmar o agendamento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.section>
        </AnimatePresence>
      </Layout>
      <LoginBtn />
      <Footer />
    </div>
  );
}
