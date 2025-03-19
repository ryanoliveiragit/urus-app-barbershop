"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { verifyCode, sendVerificationCode } from "./actions"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

const codeSchema = z.object({
  code: z.string().length(6, "O código deve ter 6 dígitos").regex(/^\d+$/, "O código deve conter apenas números"),
})

type CodeFormValues = z.infer<typeof codeSchema>

export function VerificationCodeForm({
  phoneNumber,
  onSuccess,
}: {
  phoneNumber: string
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isCodeComplete, setIsCodeComplete] = useState(false)

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const form = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  })

  // Verificar se o código está completo sempre que o valor mudar
  useEffect(() => {
    const codeValue = form.watch("code")
    setIsCodeComplete(codeValue?.length === 6)
  }, [form.watch("code")])

  const handleSubmit = async (values: CodeFormValues) => {
    if (!values.code || values.code.length !== 6) return

    setIsLoading(true)
    try {
      // Verify the code
      const result = await verifyCode(phoneNumber, values.code)
      if (result.success) {
        onSuccess()
      } else {
        form.setError("code", {
          type: "manual",
          message: "Código inválido. Tente novamente.",
        })
        form.reset()
        setIsCodeComplete(false)
      }
    } catch (error) {
      console.error("Error verifying code:", error)
      form.setError("code", {
        type: "manual",
        message: "Erro ao verificar código. Tente novamente.",
      })
      form.reset()
      setIsCodeComplete(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      await sendVerificationCode(phoneNumber)
      setCountdown(60)
      setCanResend(false)
      form.reset()
      setIsCodeComplete(false)
    } catch (error) {
      console.error("Error resending code:", error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Digite o código de 6 dígitos enviado para seu email.</p>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    disabled={isLoading}
                    className="justify-center gap-1"
                    onComplete={() => setIsCodeComplete(true)}
                  >
                    <InputOTPGroup className="ml-5 mt-2">
                      <InputOTPSlot index={0} className="w-9 h-10" />
                      <InputOTPSlot index={1} className="w-9 h-10" />
                      <InputOTPSlot index={2} className="w-9 h-10" />
                      <InputOTPSeparator /> 
                      <InputOTPSlot index={3} className="w-9 h-10 border" />
                      <InputOTPSlot index={4} className="w-9 h-10" />
                      <InputOTPSlot index={5} className="w-9 h-10" />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canResend || isResending}
            onClick={handleResendCode}
            className="text-xs flex items-center gap-1.5 h-7 px-2"
          >
            {isResending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Reenviando...
              </>
            ) : canResend ? (
              <>
                <RefreshCw className="h-3 w-3" />
                Reenviar código
              </>
            ) : (
              <>
                <span>Reenviar em {countdown}s</span>
              </>
            )}
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !isCodeComplete}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar código"
          )}
        </Button>
      </form>
    </Form>
  )
}

