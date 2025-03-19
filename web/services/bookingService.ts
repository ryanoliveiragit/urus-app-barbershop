import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface BookingParams {
  userId?: number
  professionalId: number
  serviceId: string
  appointmentDate: string
  appointmentTime: string
  paymentMethod?: string
}

export interface BookingResponse {
  id: string
  userId: number
  barberId: string
  professionalId: number
  serviceId: string
  price: string
  professionalName: string
  serviceName: string
  appointmentTime: string
  appointmentDate: string
  date: string
  time: string
  isCanceled: boolean
  service: string
  paymentMethod: string
  status: string
  createdAt: string
}

export const BookingService = {
  async createBooking(booking: BookingParams, token: string): Promise<BookingResponse> {
    const response = await axios.post<BookingResponse>(`${API_URL}/agendament`, booking, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  async getBookingsByUserId(userId: number, token: string): Promise<BookingResponse[]> {
    const response = await axios.get<BookingResponse[]>(`${API_URL}/agendament/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  async getBookingById(id: number, token: string): Promise<BookingResponse> {
    const response = await axios.get<BookingResponse>(`${API_URL}/agendament/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  async cancelBooking(id: number, token: string): Promise<BookingResponse> {
    const response = await axios.post<BookingResponse>(
      `${API_URL}/agendament/cancel`,
      { agendamentId: id }, // Este é o corpo da requisição (segundo parâmetro)
      {
        headers: {
          // Este é o objeto de configuração (terceiro parâmetro)
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )
    return response.data
  },
}

