
import { Services } from "@/@types/services"
import axios from "axios"


const API_URL = process.env.NEXT_PUBLIC_API_URL 

export const ServicesService = {
  async getServices(): Promise<Services[]> {
    const response = await axios.get<Services[]>(`${API_URL}/services`)
    return response.data
  },
}
