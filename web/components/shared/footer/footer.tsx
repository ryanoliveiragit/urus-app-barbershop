"use client";
import { Handshake, House } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export const Footer = () => {
  const { data: session } = useSession();
  return (
    <footer className="mt-auto p-3.5  justify-between bg-zinc-900  flex w-full items-center">
      <Handshake />
      <section>
      <House />
      </section>
      <Image
      src={session?.user.image ?? ''}
      alt="image user"
      className="rounded-full"
      width={40}
      height={40}
      />
    </footer>
  );
};
