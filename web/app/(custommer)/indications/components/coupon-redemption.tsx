"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, Scissors, ShoppingBag, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CouponRedemption() {
  const [couponCode, setCouponCode] = useState("")
  const [couponStatus, setCouponStatus] = useState<"idle" | "valid" | "invalid">("idle")
  const [couponDetails, setCouponDetails] = useState(null)

  const validateCoupon = () => {
    if (!couponCode.trim()) return

    // Simulate coupon validation
    if (couponCode.toUpperCase() === "NEWCLIENT25" || couponCode.toUpperCase() === "FRIEND20") {
      setCouponStatus("valid")
      setCouponDetails({
        code: couponCode.toUpperCase(),
        discount: couponCode.toUpperCase() === "NEWCLIENT25" ? "25%" : "20%",
        type: couponCode.toUpperCase() === "NEWCLIENT25" ? "Corte" : "Produtos",
        expiry: "30/04/2025",
      })
    } else {
      setCouponStatus("invalid")
      setCouponDetails(null)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Resgatar Cupom</CardTitle>
          <CardDescription>Digite o código do cupom para verificar sua validade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Código do Cupom</Label>
              <div className="flex flex-col xs:flex-row gap-2">
                <Input
                  id="coupon-code"
                  placeholder="Ex: FRIEND20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="font-mono uppercase flex-1"
                />
                <Button onClick={validateCoupon} className="w-full xs:w-auto">
                  Verificar
                </Button>
              </div>
            </div>

            {couponStatus === "valid" && (
              <Alert className="border-green-500 bg-green-500/10">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-500">Cupom Válido!</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Código:</span>
                      <span className="font-medium">{couponDetails.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Desconto:</span>
                      <span className="font-medium">{couponDetails.discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Aplicável em:</span>
                      <span className="font-medium">{couponDetails.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Válido até:</span>
                      <span className="font-medium">{couponDetails.expiry}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {couponStatus === "invalid" && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Cupom Inválido</AlertTitle>
                <AlertDescription>
                  Este código de cupom não é válido ou já expirou. Por favor, verifique e tente novamente.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cupons Populares</CardTitle>
            <CardDescription>Cupons disponíveis para todos os clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3 md:p-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <Scissors className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm md:text-base">25% OFF para Novos Clientes</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Válido para o primeiro corte</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full xs:w-auto"
                onClick={() => {
                  setCouponCode("NEWCLIENT25")
                  validateCoupon()
                }}
              >
                Aplicar
              </Button>
            </div>

            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">20% OFF em Produtos</h4>
                  <p className="text-sm text-muted-foreground">Para compras acima de R$100</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCouponCode("FRIEND20")
                  validateCoupon()
                }}
              >
                Aplicar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Como Usar</CardTitle>
            <CardDescription>Aprenda a usar seus cupons de desconto</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 md:space-y-4 list-decimal list-inside">
              <li className="text-xs md:text-sm">
                <span className="font-medium">Verifique o cupom</span>:
                <span className="block mt-1 ml-5">
                  Digite o código do cupom no campo acima e clique em "Verificar" para confirmar sua validade.
                </span>
              </li>
              <li className="text-xs md:text-sm">
                <span className="font-medium">Apresente na barbearia</span>:
                <span className="block mt-1 ml-5">Mostre o cupom validado ao barbeiro antes do início do serviço.</span>
              </li>
              <li className="text-xs md:text-sm">
                <span className="font-medium">Ou use no aplicativo</span>:
                <span className="block mt-1 ml-5">
                  Insira o código no momento do agendamento para aplicar o desconto automaticamente.
                </span>
              </li>
              <li className="text-xs md:text-sm">
                <span className="font-medium">Aproveite o desconto</span>:
                <span className="block mt-1 ml-5">O valor será deduzido automaticamente do total do serviço.</span>
              </li>
            </ol>

            <div className="mt-6 p-3 bg-muted rounded-md text-sm">
              <p className="font-medium mb-2">Observações importantes:</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>Cupons não são cumulativos com outras promoções</li>
                <li>Cada cupom pode ser utilizado apenas uma vez</li>
                <li>Verifique a data de validade antes de usar</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

