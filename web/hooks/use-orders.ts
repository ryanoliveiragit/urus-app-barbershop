import useSWR from "swr";
import axios from "axios";

interface Order {
  id: number;
  paymentId: string;
  userId: string;
}

const fetcher = async (url: string) => {
  const response = await axios.get<Order[]>(url);
  return response.data;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL 
const useUserOrders = (userId: string) => {
  const { data, error, isLoading } = useSWR<Order[], Error>(
    userId ? `${API_URL}/orders/user/${userId}` : null, // Evita chamadas desnecessárias
    fetcher
  );

  const status = error ? "error" : isLoading ? "loading" : "success";

  return {
    orders: data ?? [], // Retorna array vazio se os dados não existirem
    status,
    lastOrderId: data?.[data.length - 1]?.id ?? null,
    error,
  };
};

export default useUserOrders;
