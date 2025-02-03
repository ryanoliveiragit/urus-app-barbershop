"use client"

import { useState } from "react";

function formatAndValidateCpfCnpj(cpfCnpj: string): string {
  // Remove tudo que não for número
  const cleaned = cpfCnpj.replace(/\D/g, "");

  if (cleaned.length === 11 || cleaned.length === 14) {
    return cleaned; // Retorna o CPF/CNPJ limpo se for válido
  }

  throw new Error("CPF/CNPJ inválido.");
}

export default function PixPayment() {
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      const formattedCpfCnpj = formatAndValidateCpfCnpj("123.456.789-00");
  
      const response = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "João Silva",
          cpfCnpj: formattedCpfCnpj, // CPF/CNPJ formatado
          value: 1, // Valor em Reais
        }),
      });
  
      const data = await response.json();
      if (data.pixQrCode) {
        setPixQrCode(data.pixQrCode);
        setPixCopyPaste(data.pixCopyPaste);
      } else {
        alert("Erro ao gerar pagamento: " + (data.error || "Desconhecido"));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      alert("error.message");
    }
  };
  
  return (
    <div className="p-4">
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Gerar QR Code PIX
      </button>

      {pixQrCode && (
        <div className="mt-4">
          <p>Escaneie o QR Code:</p>
          <img src={pixQrCode} alt="QR Code PIX" className="w-48 h-48" />
{pixQrCode}
          <p className="mt-2">Ou copie e cole o código PIX:</p>
          <input
            type="text"
            readOnly
            value={pixCopyPaste ?? ""}
            className="border p-2 w-full"
          />
        </div>
      )}
    </div>
  );
}
