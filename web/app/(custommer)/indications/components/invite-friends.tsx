"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Copy,
  Facebook,
  Instagram,
  Mail,
  MessageSquare,
  Smartphone,
  PhoneIcon as WhatsApp,
  Scissors,
  ShoppingBag,
  Gift,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function InviteFriends() {
  const [emailSent, setEmailSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSendEmail = (e) => {
    e.preventDefault()
    // Simulate sending email
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText("https://barbershop.com/referral/JOAO15BARBER")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Convide por Email</CardTitle>
              <CardDescription>Envie um convite personalizado por email</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="friend-name">Nome do amigo</Label>
                  <Input id="friend-name" placeholder="Nome completo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="friend-email">Email do amigo</Label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Input id="friend-email" type="email" placeholder="email@exemplo.com" className="flex-1" />
                    <Button type="submit" className="w-full xs:w-auto" disabled={emailSent}>
                      {emailSent ? "Email Enviado!" : "Enviar Convite"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem personalizada (opcional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Escreva uma mensagem personalizada..."
                    defaultValue="Ei! Estou usando esta barbearia incrível e achei que você também gostaria. Use meu código para ganhar 20% de desconto no seu primeiro corte!"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compartilhe seu Link</CardTitle>
              <CardDescription>Compartilhe seu link de indicação nas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Seu link de indicação</Label>
                <div className="flex gap-2">
                  <Input readOnly value="https://barbershop.com/referral/JOAO15BARBER" className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={copyLink}>
                    {copied ? <span className="text-green-500 text-xs">Copiado!</span> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Compartilhar via</Label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start gap-2">
                    <WhatsApp className="h-4 w-4 text-green-500" /> WhatsApp
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <Instagram className="h-4 w-4 text-pink-500" /> Instagram
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <Facebook className="h-4 w-4 text-blue-500" /> Facebook
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <Mail className="h-4 w-4 text-red-500" /> Email
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Contatos Recentes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Avatar className="h-7 w-7 md:h-8 md:w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>RM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs md:text-sm font-medium">Rafael Mendes</p>
                        <p className="text-xs text-muted-foreground">Convidado há 2 dias</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 md:h-8 md:px-3">
                      <MessageSquare className="h-3 w-3 md:mr-1" />
                      <span className="hidden md:inline">Lembrar</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Avatar className="h-7 w-7 md:h-8 md:w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>LS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs md:text-sm font-medium">Lucas Silva</p>
                        <p className="text-xs text-muted-foreground">Convidado há 5 dias</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 md:h-8 md:px-3">
                      <MessageSquare className="h-3 w-3 md:mr-1" />
                      <span className="hidden md:inline">Lembrar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Benefícios do Programa</CardTitle>
            <CardDescription>Veja o que você e seus amigos ganham</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="friends">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="friends">Para seus amigos</TabsTrigger>
                <TabsTrigger value="you">Para você</TabsTrigger>
              </TabsList>

              <TabsContent value="friends" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">20% OFF</h4>
                    <p className="text-sm text-muted-foreground">No primeiro corte de cabelo</p>
                  </div>

                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">10% OFF</h4>
                    <p className="text-sm text-muted-foreground">Em produtos na primeira compra</p>
                  </div>

                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">Acesso VIP</h4>
                    <p className="text-sm text-muted-foreground">Ao aplicativo de agendamento</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="you" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">15% OFF</h4>
                    <p className="text-sm text-muted-foreground">Para cada amigo que usar seu código</p>
                  </div>

                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">Corte Grátis</h4>
                    <p className="text-sm text-muted-foreground">Após 5 amigos indicados</p>
                  </div>

                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">Status VIP</h4>
                    <p className="text-sm text-muted-foreground">Após 10 amigos indicados</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Os benefícios são válidos por 30 dias após a indicação. Consulte os termos e condições para mais detalhes.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

