"use client";
import { Calendar, Users, Crown, Briefcase, Flame } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Footer = ({ className }: { className?: string }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Função para verificar se uma rota está ativa
  const isActive = (path: string) => {
    // Para a página de agendamentos, verificamos o caminho principal e subpáginas
    if (path === "/") {
      return pathname === "/" || 
             pathname === "/agendamentos" || 
             pathname.startsWith("/agendamentos/");
    }
    return pathname === path;
  };

  // Verificar se está na seção de agendamentos (página principal ou subpáginas)
  const isAgendamentosSection = isActive("/");

  return (
    <footer className={`mt-auto p-3.5 justify-between bg-zinc-900 flex w-full items-center ${className}`}>
      {/* Indicações */}
      <Link href="/indications" className="flex flex-col items-center">
        <Users 
          className={cn(
            "w-5 h-5", 
            isActive("/indications") ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <span 
          className={cn(
            "text-[10px] mt-1", 
            isActive("/indications") ? "text-primary" : "text-muted-foreground"
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
      
      {/* Ícone de agendamento (página inicial, abrange todas as subpáginas de agendamentos) */}
      <Link href="/agendament" className="flex flex-col items-center">
        <Calendar 
          className={cn(
            "w-6 h-6", 
            isAgendamentosSection ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <span 
          className={cn(
            "text-[10px] mt-1", 
            isAgendamentosSection ? "text-primary" : "text-muted-foreground"
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
      <Link href="/profile">
        <Image
          src={session?.user?.image ?? ''}
          alt="image user"
          className={cn(
            "rounded-full -mt-2", 
            isActive("/profile") ? "ring-2 ring-primary" : ""
          )}
          width={40}
          height={40}
        />
      </Link>
    </footer>
  );
};