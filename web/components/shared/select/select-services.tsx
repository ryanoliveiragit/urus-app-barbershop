"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useServices } from "@/hooks/useServices";
import { Services as ServviceTYPE } from "@/@types/services";

interface SelectServicesProps {
  setSelectedServicesAPI: (name: string, id: string, price: string, time: number) => void;
  closeDrawer: () => void;
}

export const SelectServices = ({
  setSelectedServicesAPI,
  closeDrawer,
}: SelectServicesProps) => {
  const { services, isLoading, isError } = useServices();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading services</div>;

  const handleSelectService = (service: ServviceTYPE) => {
    setSelectedServicesAPI(service.name, service.id, service.price.toString(), service.time);
    setSelectedServiceId(service.id);
    closeDrawer(); 
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Selecione o serviço</DrawerTitle>
        <DrawerDescription>
          Escolha o serviço de sua preferência.
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 space-y-4">
        {services?.map((service) => (
          <Button
            key={service.id}
            variant={selectedServiceId === service.id ? "default" : "secondary"}
            className="w-full justify-start font-semibold"
            onClick={() => handleSelectService(service)}
          >
            <div className="text-left text-[16px] flex w-full justify-between items-center ">
              <div className="flex flex-col mt-1 ">
                <span>{service.name}</span>
                <span className="text-sm font-normal"> {service.time} min</span>
              </div>
              <span className="text-lg">R$ {service.price}</span>
            </div>
          </Button>
        ))}
      </div>
    </DrawerContent>
  );
};
