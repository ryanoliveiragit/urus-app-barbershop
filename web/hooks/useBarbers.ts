import { Barber } from '@/@types/barber';
import { BarberService } from '@/services/barberService';
import useSWR from 'swr'

export function useBarbers() {
  const { data, error, isLoading } = useSWR<Barber[]>("barbers", BarberService.getBarbers)

  return {
    barbers: data,
    isLoading,
    isError: error,
  }
}

