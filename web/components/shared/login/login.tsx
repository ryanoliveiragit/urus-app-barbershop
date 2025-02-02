"use client";
import { User } from "@/@types/user";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";



export const LoginBtn = () => {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      sendUserDataToBackend(session?.user)
    }
  }, [status, session]);

  const handleLogin = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error(`Erro ao fazer login com o ${provider}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const sendUserDataToBackend = async (user: User) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
            googleId: user.id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Usuário enviado para o backend:", data);
      } else {
        console.error(
          "Erro ao enviar os dados para o backend:",
          response.status
        );
      }
    } catch (error) {
      console.error("Erro ao enviar os dados para o backend:", error);
    }
  };

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="h-screen w-screen bg-gray-400">
      <div className="fixed grid place-items-center backdrop-blur-sm top-0 right-0 left-0 z-50 w-full inset-0 h-modal h-full justify-center items-center">
        <div className="relative container m-auto px-6">
          <div className="m-auto md:w-7/12">
            <div className="rounded-xl bg-white dark:bg-gray-800 shadow-xl">
              <div className="p-8">
                <div className="space-y-4">
                  <Image
                    width={20}
                    height={20}
                    alt="logo"
                    src="https://www.svgrepo.com/show/475643/dribbble-color.svg"
                    loading="lazy"
                  />
                  <h2 className="mb-8 text-2xl text-cyan-900 dark:text-white font-bold">
                    Faça login para desbloquear o <br /> melhor da Urus
                    Barbearia.
                  </h2>
                </div>
                <div className="mt-10 grid space-y-4">
                  <button
                    onClick={() => handleLogin("google")}
                    className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
                    disabled={loading}
                  >
                    <div className="relative flex items-center space-x-4 justify-center">
                      <Image
                        width={20}
                        height={20}
                        alt="logo"
                        className="absolute left-0 w-5"
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        loading="lazy"
                      />
                      <span className="block w-max font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                        {loading ? "Carregando..." : "Continuar com Google"}
                      </span>
                    </div>
                  </button>
                </div>
                <div className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
                  <p className="text-xs">
                    Ao prosseguir, você concorda com nossos
                    <a href="/privacy-policy/" className="underline">
                      {" "}
                      Termos de Uso
                    </a>{" "}
                    e confirma que leu nossa
                    <a href="/privacy-policy/" className="underline">
                      {" "}
                      Política de Privacidade e Cookies
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
