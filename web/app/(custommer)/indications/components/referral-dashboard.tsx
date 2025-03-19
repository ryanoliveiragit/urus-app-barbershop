"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Clock, Copy, DollarSign, Gift, Scissors, Share2, ShoppingBag, Ticket, Users } from "lucide-react"

export function ReferralDashboard() {
  const [copied, setCopied] = useState(false)

  const copyReferralCode = () => {
    navigator.clipboard.writeText("JOAO15BARBER")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Total Economizado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold">R$ 157,50</div>
            <p className="text-xs text-muted-foreground">+R$ 22,50 no último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Amigos Indicados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 no último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Cupons Ativos</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 expira em 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">Próximo Benefício</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold">2 amigos</div>
            <p className="text-xs text-muted-foreground">Para ganhar corte grátis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Seu Código de Indicação</CardTitle>
            <CardDescription>Compartilhe este código com seus amigos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <span className="font-mono font-bold">JOAO15BARBER</span>
              <Button variant="ghost" size="icon" onClick={copyReferralCode} className="h-8 w-8">
                {copied ? <span className="text-green-500 text-xs">Copiado!</span> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Share2 className="h-4 w-4" /> Compartilhar via WhatsApp
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Share2 className="h-4 w-4" /> Compartilhar via Email
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Progresso para próximo nível</h4>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full w-[70%]"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">7/10 indicações para se tornar Cliente VIP</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Seus Cupons</CardTitle>
            <CardDescription>Gerencie seus cupons de desconto</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="used">Utilizados</TabsTrigger>
                <TabsTrigger value="expired">Expirados</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <div className="border rounded-lg p-3 md:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                        <Scissors className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm md:text-base">15% OFF em Corte</h4>
                        <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2">
                          <Badge variant="outline" className="text-xs">
                            AMIGO15
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Expira em 15 dias
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 px-2 md:px-3">
                      Usar
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3 md:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                        <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm md:text-base">20% OFF em Produtos</h4>
                        <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2">
                          <Badge variant="outline" className="text-xs">
                            PROD20
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Expira em 7 dias
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 px-2 md:px-3">
                      Usar
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3 md:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                        <Scissors className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm md:text-base">Corte + Barba com 25% OFF</h4>
                        <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2">
                          <Badge variant="outline" className="text-xs">
                            COMBO25
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Expira em 30 dias
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 px-2 md:px-3">
                      Usar
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="used" className="space-y-4 pt-4">
                <div className="border rounded-lg p-4 flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted p-2 rounded-full">
                      <Scissors className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">15% OFF em Corte</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          AMIGO15
                        </Badge>
                        <span className="text-xs text-muted-foreground">Economizou R$ 22,50</span>
                      </div>
                    </div>
                  </div>
                  <Badge>Utilizado</Badge>
                </div>

                <div className="border rounded-lg p-4 flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted p-2 rounded-full">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">30% OFF em Produtos</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ANIV30
                        </Badge>
                        <span className="text-xs text-muted-foreground">Economizou R$ 45,00</span>
                      </div>
                    </div>
                  </div>
                  <Badge>Utilizado</Badge>
                </div>
              </TabsContent>

              <TabsContent value="expired" className="space-y-4 pt-4">
                <div className="border rounded-lg p-4 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted p-2 rounded-full">
                      <Scissors className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Corte Grátis</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          WELCOME
                        </Badge>
                        <span className="text-xs text-muted-foreground">Expirou em 10/03/2025</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">Expirado</Badge>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Economias</CardTitle>
          <CardDescription>Acompanhe quanto você economizou com o programa de indicações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
              <span>Gráfico de economias por mês</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

