"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, MessageSquare, Mail, Check } from "lucide-react"
import { saveNotificationPreferences } from "./actions"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type NotificationChannel = "email" | "whatsapp" | "both"

export function NotificationPreferences({
  onSaved,
}: {
  onSaved: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [preference, setPreference] = useState<NotificationChannel>("whatsapp")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await saveNotificationPreferences(preference)

      // Mostrar toast de confirmação
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de notificação foram salvas com sucesso.",
        variant: "default",
        action: (
          <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        ),
      })

      // Fechar o modal e prosseguir com o agendamento
      onSaved()
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas preferências. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Escolha como deseja receber notificações sobre seus agendamentos.
        </p>

        <RadioGroup
          value={preference}
          onValueChange={(value) => setPreference(value as NotificationChannel)}
          className="space-y-2"
        >
          <div
            className={cn(
              "flex items-center space-x-2 rounded-md border p-2.5 transition-all",
              preference === "whatsapp" && "border-primary/50 bg-primary/5",
            )}
          >
            <RadioGroupItem value="whatsapp" id="whatsapp" className="border-primary h-4 w-4" />
            <Label htmlFor="whatsapp" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-green-500" />
                <div className="font-medium text-sm">WhatsApp</div>
              </div>
            </Label>
          </div>

          <div
            className={cn(
              "flex items-center space-x-2 rounded-md border p-2.5 transition-all",
              preference === "email" && "border-primary/50 bg-primary/5",
            )}
          >
            <RadioGroupItem value="email" id="email" className="border-primary h-4 w-4" />
            <Label htmlFor="email" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-blue-500" />
                <div className="font-medium text-sm">Email</div>
              </div>
            </Label>
          </div>

          <div
            className={cn(
              "flex items-center space-x-2 rounded-md border p-2.5 transition-all",
              preference === "both" && "border-primary/50 bg-primary/5",
            )}
          >
            <RadioGroupItem value="both" id="both" className="border-primary h-4 w-4" />
            <Label htmlFor="both" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  <MessageSquare className="h-3.5 w-3.5 text-green-500" />
                  <Mail className="h-3.5 w-3.5 text-blue-500 -ml-1" />
                </div>
                <div className="font-medium text-sm">Ambos</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar e agendar"
        )}
      </Button>
    </form>
  )
}

