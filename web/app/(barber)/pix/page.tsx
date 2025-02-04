"use client"
import React, { useState } from 'react';

export default function PixPayment() {
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixKey] = useState<string>('3dfecdd0-8598-4b93-bff7-e9a9ca252ced');
  const [loading, setLoading] = useState<boolean>(false);

  const generatePixQrCode = async () => {
    setLoading(true);

    const payload = {
      addressKey: "3dfecdd0-8598-4b93-bff7-e9a9ca252ced",
      description: "teste",
      value: 1,
    };

    try {
      // Faz a chamada à API da Asaas para gerar o QR Code PIX
      const response = await fetch('https://api.asaas.com/v3/pix/qrCodes/static', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': `${process.env.ASAAS_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar QR Code PIX');
      }

      const data = await response.json();
      setPixQrCode(data.encodedImage); // Supondo que a API retorne o QR Code em base64
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar QR Code PIX');
    } finally {
      setLoading(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey).then(() => {
      alert('Chave PIX copiada com sucesso!');
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={generatePixQrCode}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Gerando QR Code...' : 'Gerar QR Code PIX'}
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