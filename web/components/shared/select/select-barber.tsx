"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useBarbers } from "@/hooks/useBarbers";

import Image from "next/image";
import { Barber } from "@/@types/barber";

interface SelectBarberProps {
  setSelectedProfessional: (name: string, id: string, image: string) => void;
  closeDrawer: () => void;
}

export const SelectBarber = ({
  setSelectedProfessional,
  closeDrawer,
}: SelectBarberProps) => {
  const { barbers, isLoading, isError } = useBarbers();
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading barbers</div>;

  const handleSelectBarber = (barber: Barber) => {
    setSelectedBarberId(barber.id);
    setSelectedProfessional(barber.name, barber.id, barber.image); 
    closeDrawer();
  };
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Selecione o barbeiro</DrawerTitle>
        <DrawerDescription>
          Escolha o profissional de sua preferência.
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 space-y-4">
        {barbers?.map((barber) => (
          <Button
            key={barber.id}
            variant={selectedBarberId === barber.id ? "default" : "secondary"}
            className="w-full justify-start"
            onClick={() => handleSelectBarber(barber)}
          >
            <Image
              src={barber.image || "/placeholder.svg"}
              alt={barber.name}
              width={40}
              height={40}
              className="rounded-full mr-2"
            />
            <div className="text-left flex flex-col gap-.5 text-sm">
              <span className="font-semibold">{barber.name}</span>
              <span className="font-medium ">{barber.specialty}</span>
            </div>
          </Button>
        ))}
      </div>
    </DrawerContent>
  );
};
