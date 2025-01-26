
import { Services } from '@/@types/services';
import { ServicesService } from '@/services/servicesServices';
import useSWR from 'swr'

export function useServices() {
  const { data, error, isLoading } = useSWR<Services[]>("services", ServicesService.getServices)

  return {
    services: data,
    isLoading,
    isError: error,
  }
}

