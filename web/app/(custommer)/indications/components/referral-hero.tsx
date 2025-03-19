import { Button } from "@/components/ui/button"
import { Scissors, Users, Percent } from "lucide-react"

export function ReferralHero() {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-4 md:p-6 shadow-md">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-zinc-900/60 z-10" />
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/placeholder.svg?height=400&width=800')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-20 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 md:mb-4">
          Programa de Indicações
        </h1>
        <p className="text-base md:text-lg text-zinc-200 mb-4 md:mb-6">
          Indique amigos para nossa barbearia e ganhe descontos exclusivos. Quanto mais amigos você indicar, maiores
          serão seus benefícios.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
            <div className="bg-primary/20 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-white">Indique amigos</p>
              <p className="text-sm text-zinc-400">Compartilhe seu código</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
            <div className="bg-primary/20 p-2 rounded-full">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-white">Eles ganham</p>
              <p className="text-sm text-zinc-400">20% no primeiro corte</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
            <div className="bg-primary/20 p-2 rounded-full">
              <Percent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-white">Você ganha</p>
              <p className="text-sm text-zinc-400">15% em seu próximo serviço</p>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          Começar a Indicar
        </Button>
      </div>
    </div>
  )
}

