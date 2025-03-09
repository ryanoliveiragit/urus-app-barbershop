"use client";
import { Calendar, Users, Crown, Briefcase, Flame } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Função para verificar se uma rota está ativa
  const isActive = (path: string) => pathname === path;

  return (
    <footer className="mt-auto p-3.5 justify-between bg-zinc-900 flex w-full items-center">
      {/* Indicações */}
      <Link href="/indicacoes" className="flex flex-col items-center">
        <Users 
          className={cn(
            "w-5 h-5", 
            isActive("/indicacoes") ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <span 
          className={cn(
            "text-[10px] mt-1", 
            isActive("/indicacoes") ? "text-primary" : "text-muted-foreground"
          )}
        >
          Indicações
        </span>
      </Link>
      
      {/* VIP (antigo Planos) */}
      <Link href="/vip" className="flex flex-col items-center">
        <Crown 
          className={cn(
            "w-5 h-5", 
            isActive("/vip") ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <span 
          className={cn(
            "text-[10px] mt-1", 
            isActive("/vip") ? "text-primary" : "text-muted-foreground"
          )}
        >
          VIP
        </span>
      </Link>
      
      {/* Ícone de agendamento (página inicial) */}
      <Link href="/" className="flex flex-col items-center">
        <Calendar 
          className={cn(
            "w-6 h-6", 
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <span 
          className={cn(
            "text-[10px] mt-1", 
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}
        >
          Agendamentos
        </span>
      </Link>
      
      {/* Trabalhe conosco - com ícone de fogo */}
      <Link href="/trabalhe" className="flex flex-col items-center relative">
        <Briefcase 
          className={cn(
            "w-5 h-5", 
            isActive("/trabalhe") ? "text-primary" : "text-muted-foreground"
          )} 
        />
        {/* Ícone de fogo sobreposto, preenchido de laranja */}
        <Flame className="w-3 h-3 absolute -top-1 -right-1 text-orange-500 fill-orange-500"/>
        <span 
          className={cn(
            "text-[10px] mt-1", 
            isActive("/trabalhe") ? "text-primary" : "text-muted-foreground"
          )}
        >
          Trabalhe
        </span>
      </Link>
      
      {/* Avatar do usuário */}
      <Link href="/perfil">
        <Image
          src={session?.user?.image ?? ''}
          alt="image user"
          className="rounded-full -mt-2"
          width={40}
          height={40}
        />
      </Link>
    </footer>
  );
};