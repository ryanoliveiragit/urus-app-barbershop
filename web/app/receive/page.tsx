import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL); // Troque pela URL real do seu backend

export default function WebhookListener() {
  const [webhookData, setWebhookData] = useState(null);

  useEffect(() => {
    socket.on("webhookEvent", (data) => {
      console.log("🔔 Novo webhook recebido:", data);
      setWebhookData(data);
    });

    return () => {
      socket.off("webhookEvent"); // Remove o listener ao desmontar o componente
    };
  }, []);

  return (
    <div>
      <h2>Webhook Data:</h2>
      <pre>{JSON.stringify(webhookData, null, 2)}</pre>
    </div>
  );
}
