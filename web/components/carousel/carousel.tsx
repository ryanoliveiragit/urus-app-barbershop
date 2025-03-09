"use client";
import * as React from "react";
import Image from "next/image";


import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "@/components/ui/carousel";

// Array de URLs de imagens de barbearias
const barbershopImages = [
  "/barbearia.webp",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
];

export function CarouselBarbershop() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {barbershopImages.map((imageUrl, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[240px] w-full">
              <Image
                src={imageUrl}
                alt={`Barbearia ${index + 1}`}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
              {/* Overlay gradiente preto de baixo para cima */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              
              {/* Logo centralizado */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Image
                  src={"/logo_barbosa.svg"}
                  alt="Logo Barboza"
                  width={260}
                  height={0}
                  className="invert -mt-20"
                />
                <h1 className="text-2xl font-bold text-white -mt-16">Agende seu horário</h1>
                <p className="text-muted-foreground text-sm mt-2 max-w-md text-center px-4">
                  Escolha os serviços que desejar e agende no horário que preferir
                </p>

              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}