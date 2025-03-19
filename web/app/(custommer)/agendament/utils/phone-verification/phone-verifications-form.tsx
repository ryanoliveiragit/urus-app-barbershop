"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2, Phone } from "lucide-react"
import { sendVerificationCode } from "./actions"
import { cn } from "@/lib/utils"

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "O número de telefone deve ter pelo menos 10 dígitos")
    .max(15, "O número de telefone não pode ter mais de 15 dígitos")
    .regex(/^\d+$/, "O número de telefone deve conter apenas dígitos"),
})

type PhoneFormValues = z.infer<typeof phoneSchema>

export function PhoneVerificationForm({
  onSubmit,
}: {
  onSubmit: (phone: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  })

  const handleSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true)
    try {
      // Send verification code to user's email
      await sendVerificationCode(values.phone)
      onSubmit(values.phone)
    } catch (error) {
      console.error("Error sending verification code:", error)
      form.setError("phone", {
        type: "manual",
        message: "Erro ao enviar código de verificação. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Este número será usado para comunicações importantes sobre seus agendamentos.
          </p>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium">Número de telefone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="(00) 00000-0000"
                      className={cn("pl-8 h-9 text-sm transition-all", isLoading && "opacity-50")}
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted/50 rounded-lg p-2.5 flex items-start gap-2">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground text-xs">Verificação por email</p>
            <p className="mt-0.5 text-xs">Enviaremos um código para seu email cadastrado.</p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar código"
          )}
        </Button>
      </form>
    </Form>
  )
}

