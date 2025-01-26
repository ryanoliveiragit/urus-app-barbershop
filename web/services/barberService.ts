import { Barber } from "@/@types/barber"
import axios from "axios"


const API_URL = process.env.NEXT_PUBLIC_API_URL 

export const BarberService = {
  async getBarbers(): Promise<Barber[]> {
    const response = await axios.get<Barber[]>(`${API_URL}/user/barbers`)
    return response.data
  },
}
