"use client"

import { Menu, Bell, Search } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-zinc-900 border-zinc-800">
              <SheetHeader>
                <SheetTitle className="text-left text-primary">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/agendamentos" className="text-sm font-medium hover:text-primary transition-colors">
                  Agendamentos
                </Link>
                <Link href="/indications" className="text-sm font-medium hover:text-primary transition-colors">
                  Indicações
                </Link>
                <Link href="/vip" className="text-sm font-medium hover:text-primary transition-colors">
                  VIP
                </Link>
                <Link
                  href="/trabalhe"
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                >
                  Trabalhe Conosco
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] px-1.5 py-0">Novo</Badge>
                </Link>
                <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                  Meu Perfil
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary">Barbearia</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/agendamentos" className="text-sm font-medium hover:text-primary transition-colors">
            Agendamentos
          </Link>
          <Link href="/indications" className="text-sm font-medium hover:text-primary transition-colors">
            Indicações
          </Link>
          <Link href="/vip" className="text-sm font-medium hover:text-primary transition-colors">
            VIP
          </Link>
          <Link
            href="/trabalhe"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
          >
            Trabalhe Conosco
            <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] px-1.5 py-0">Novo</Badge>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              3
            </span>
            <span className="sr-only">Notificações</span>
          </Button>

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image ?? ""} alt="Avatar" />
              <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium leading-none">{session?.user?.name || "Usuário"}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email || "usuario@exemplo.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

