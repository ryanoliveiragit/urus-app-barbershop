"use client";
import { useState } from "react";
import { Layout } from "@/components/shared/layout";
import { SelectBarber } from "@/components/shared/select/select-barber";
import { SelectDate } from "@/components/shared/select/select-date";
import { SelectServices } from "@/components/shared/select/select-services";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import {
  Calendar,
  ChevronRight,
  HomeIcon as House,
  Scissors,
  User,
} from "lucide-react";
import Image from "next/image";
import imgHeadere from "../public/urus.jpeg";
import axios from "axios";
import { formatDateString } from "@/utils/date-object";

interface Service {
  name: string;
  id: string;
  price: number;
}

export default function Home() {
  const [selectProfessional, setSelectedProfessional] = useState<{
    name: string;
    id: string;
    image: string;
  }>({
    name: "Selecione o profissional",
    id: "",
    image: "",
  });

  const [selectServicesAPI, setSelectedServiceAPI] = useState<Service[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: string;
    time: string;
  }>({
    date: "",
    time: "",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenServices, setIsDrawerOpenServices] = useState(false);

  const handleSelectProfessional = (
    name: string,
    id: string,
    image: string
  ) => {
    setSelectedProfessional({ name, id, image });
    setIsDrawerOpen(false);
  };

  const handleDateSelect = (date: Date, time: string) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    setSelectedDateTime({ date: formattedDate, time });
  };

  const handleSelectServices = (name: string, id: string, price: number) => {
    setSelectedServiceAPI([{ name, id, price }]);
    setIsDrawerOpenServices(false);
  };

  const closeDrawer = () => setIsDrawerOpen(false);
  const closeDrawerServices = () => setIsDrawerOpenServices(false);

  const handleSubmit = async () => {
    if (
      !selectProfessional.id ||
      selectServicesAPI.length === 0 ||
      !selectedDateTime.date ||
      !selectedDateTime.time
    ) {
      return;
    }

    const appointmentData = {
      userId: 1, // Exemplo de ID do usuário (substituir pelo real)
      professionalId: parseInt(selectProfessional.id),
      serviceId: selectServicesAPI[0].id,
      appointmentDate: selectedDateTime.date,
      appointmentTime: selectedDateTime.time,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/agendament`,
        appointmentData
      );
      console.log("Agendamento criado com sucesso:", response.data);
      alert("Agendamento realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Erro ao realizar agendamento. Tente novamente.");
    }
  };

  const isButtonDisabled =
    !selectProfessional.id ||
    selectServicesAPI.length === 0 ||
    !selectedDateTime.date ||
    !selectedDateTime.time;

  return (
    <div className="flex flex-col h-svh  bg-gradient-to-t from-black  to-transparent">
      <header className="absolute -z-10 -top-14">
        <Image
          src={imgHeadere || "/placeholder.svg"}
          width={800}
          height={500}
          alt="Imagem de cabeçalho"
          className="object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </header>
      <Layout>
        <section className="flex flex-col gap-4 mt-[9rem]">
          <section className="text-md text-center flex-col flex gap-3">
            <h1 className="text-2xl font-semibold">Agende seu horário</h1>
            <p className="text-[#D4D4D4] font-medium text-[14px]">
              Escolha os serviços que desejar e agende no horário que preferir
            </p>
          </section>

          {/* Select Professional */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 text-white h-[72px] px-4 rounded-2xl"
                onClick={() => setIsDrawerOpen(true)}
              >
                <div className="flex items-center justify-center gap-3">
                  {selectProfessional.image ? (
                    <Image
                      src={selectProfessional.image}
                      alt="Foto do barbeiro"
                      width={45}
                      height={45}
                      className="border-2  rounded-full"
                    />
                  ) : (
                    <User className="w-24 h-24" />
                  )}
                  <span className="text-lg">{selectProfessional.name}</span>
                </div>
                <ChevronRight className="w-6 h-6" />
              </Button>
            </DrawerTrigger>
            <SelectBarber
              setSelectedProfessional={handleSelectProfessional}
              closeDrawer={closeDrawer}
            />
          </Drawer>

          {/* Select Service */}
          <Drawer
            open={isDrawerOpenServices}
            onOpenChange={setIsDrawerOpenServices}
          >
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 text-white h-[72px] px-4 rounded-2xl"
                onClick={() => setIsDrawerOpenServices(true)}
              >
                <div className="flex items-center justify-center gap-3">
                  <Scissors className="w-6 h-6" />
                  <span className="text-lg">
                    {selectServicesAPI.length > 0
                      ? selectServicesAPI
                          .map((service) => service.name)
                          .join(", ")
                      : "Escolher Serviços"}
                  </span>
                </div>
                <ChevronRight className="w-6 h-6" />
              </Button>
            </DrawerTrigger>
            <SelectServices
              setSelectedServicesAPI={handleSelectServices}
              closeDrawer={closeDrawerServices}
            />
          </Drawer>

          {/* Select Date */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 text-white h-[72px] px-4 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <span className="text-lg">
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
                <ChevronRight className="w-6 h-6" />
              </Button>
            </DrawerTrigger>
            <SelectDate onDateSelect={handleDateSelect} />
          </Drawer>

          {/* Submit Button */}
          <Button
            variant="default"
            disabled={isButtonDisabled}
            className="flex items-center w-full  bg-white text-black p-8"
            onClick={handleSubmit}
          >
            <span className="text-md font-semibold">Realizar agendamento</span>
          </Button>
        </section>
      </Layout>

      <footer className="mt-auto p-3.5 bg-zinc-900 justify-center flex w-full items-center">
        <House />
      </footer>
    </div>
  );
}
