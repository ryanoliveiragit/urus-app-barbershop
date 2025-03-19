"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VerificationCodeForm } from "./verification-code-form"
import { cn } from "@/lib/utils"
import { CheckCircle2, Phone, ShieldCheck, BellRing } from "lucide-react"
import { PhoneVerificationForm } from "./phone-verifications-form"
import { NotificationPreferences } from "./notifications-preferences"

type Step = "phone" | "verification" | "preferences"

export function PhoneVerificationModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [step, setStep] = useState<Step>("phone")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone)
    setStep("verification")
  }

  const handleVerificationSuccess = () => {
    setStep("preferences")
  }

  const handlePreferencesSaved = () => {
    // Fechar o modal
    onOpenChange(false)

    // Reset o estado para uso futuro
    setTimeout(() => {
      setStep("phone")
    }, 300) // Pequeno atraso para garantir que o modal feche primeiro

    // Chamar o callback onSuccess se fornecido para prosseguir com o agendamento
    if (onSuccess) {
      onSuccess()
    }
  }

  const titles = {
    phone: "Vincular número de telefone",
    verification: "Verificar código",
    preferences: "Preferências de notificação",
  }

  const icons = {
    phone: <Phone className="h-4 w-4 text-primary" />,
    verification: <ShieldCheck className="h-4 w-4 text-primary" />,
    preferences: <BellRing className="h-4 w-4 text-primary" />,
  }

  const steps = [
    { id: "phone", label: "Telefone" },
    { id: "verification", label: "Verificação" },
    { id: "preferences", label: "Preferências" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[325px] p-4 pt-5">
        <DialogHeader className="space-y-2 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2 text-base">
              {icons[step]}
              {titles[step]}
            </DialogTitle>
          </div>

          <div className="flex items-center justify-between pt-1">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                {i > 0 && (
                  <div
                    className={cn(
                      "h-0.5 w-6 mx-1",
                      steps.findIndex((x) => x.id === step) >= i ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full w-5 h-5 text-[10px] font-medium",
                    step === s.id
                      ? "bg-primary text-primary-foreground"
                      : steps.findIndex((x) => x.id === step) > steps.findIndex((x) => x.id === s.id)
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {steps.findIndex((x) => x.id === step) > steps.findIndex((x) => x.id === s.id) ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    i + 1
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogHeader>

        {step === "phone" && <PhoneVerificationForm onSubmit={handlePhoneSubmit} />}

        {step === "verification" && (
          <VerificationCodeForm phoneNumber={phoneNumber} onSuccess={handleVerificationSuccess} />
        )}

        {step === "preferences" && <NotificationPreferences onSaved={handlePreferencesSaved} />}
      </DialogContent>
    </Dialog>
  )
}

