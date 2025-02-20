"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

export default function PixPayment() {
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixKey] = useState<string>("3dfecdd0-8598-4b93-bff7-e9a9ca252ced");
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSocket] = useState<unknown>(null); // Socket.IO client instance
  const router = useRouter();

  useEffect(() => {
    // Conecta ao servidor Socket.IO
    const socket = io("https://urus-app-barbershop.onrender.com"); // Substitua pela URL correta do seu servidor
    setSocket(socket);

    // Escuta as mensagens do servidor
    socket.on("payment_received", (data: { transactionId: string; amount: number }) => {
      console.log("🚀 Pagamento recebido:", data);
      router.push("/pagamento-sucesso");
    });

    return () => {
      socket.disconnect(); // Desconecta o socket quando o componente for desmontado
    };
  }, [router]);

  const generatePixQrCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pix", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar QR Code PIX");
      }

      const data = await response.json();
      setPixQrCode(data.qrCode);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao gerar QR Code PIX");
    } finally {
      setLoading(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey).then(() => {
      alert("Chave PIX copiada com sucesso!");
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={generatePixQrCode}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Gerando QR Code..." : "Gerar QR Code PIX"}
      </button>

      <div className="mt-4">
        <p>Escaneie o QR Code:</p>
        {pixQrCode ? (
          <img
            src={`data:image/png;base64,${pixQrCode}`}
            alt="QR Code PIX"
            className="w-full max-w-xs"
          />
        ) : (
          <p>Nenhum QR Code gerado ainda.</p>
        )}
      </div>

      <div className="mt-4">
        <p>Ou copie e cole a chave PIX:</p>
        <div className="flex items-center">
          <input
            type="text"
            value={pixKey}
            readOnly
            className="border p-2 rounded-l flex-grow"
          />
          <button
            onClick={copyPixKey}
            className="bg-green-500 text-white p-2 rounded-r"
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  );
}
