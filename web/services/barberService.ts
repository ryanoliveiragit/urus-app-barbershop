import type { Barber } from "@/@types/barber"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const BarberService = {
  async getBarbers(): Promise<Barber[]> {
    // Get token from localStorage or wherever you store it
    const token = localStorage.getItem("token")

    const response = await axios.get<Barber[]>(`${API_URL}/user/barbers`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to Authorization header
      },
    })

    return response.data
  },
}

