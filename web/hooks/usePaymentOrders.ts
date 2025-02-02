import useSWR from 'swr';
import { PaymentService } from '@/services/paymentService';
import { PaymentOrder } from '@/@types/payment-order';
import { useSession } from 'next-auth/react';

export function usePaymentOrders(email: string) {
  const { data: session } = useSession();
  
  const { data, error, isLoading } = useSWR<PaymentOrder[]>(
    email ? [`orders`, email] : null, 
    () => PaymentService.getPaymentOrders(session?.user.email ?? '')
  );

  // Pegando a última ordem, se houver
  const lastPaymentOrder = data?.length ? data[data.length - 1] : null;

  return {
    paymentOrders: lastPaymentOrder, 
    isLoading,
    isError: error,
  };
}
