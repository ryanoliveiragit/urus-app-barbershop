// services/bookingService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface BookingParams {
    userId?: string;
    professionalId: number;  // Changed from string to number
    serviceId: string;
    appointmentDate: string;
    appointmentTime: string;
    paymentMethod?: string;
  }

  export interface BookingResponse {
    id: string;
    userId: string;
    barberId: string;
    professionalId: number;
    serviceId: string;
    price: string;
    // Add these properties to match the Appointment type
    professionalName: string;
    serviceName: string;
    
    appointmentTime: string;
    appointmentDate: string;
    date: string;
    time: string;
    
    isCanceled: boolean;
    service: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
  }

export const BookingService = {
  async createBooking(
    booking: BookingParams, 
    token: string
  ): Promise<BookingResponse> {
    const response = await axios.post<BookingResponse>(
      `${API_URL}/agendament`,
      booking,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async getBookingsByUserId(
    userId: string,
    token: string
  ): Promise<BookingResponse[]> {
    const response = await axios.get<BookingResponse[]>(
      `${API_URL}/agendament/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async getBookings(token: string): Promise<BookingResponse[]> {
    const response = await axios.get<BookingResponse[]>(
      `${API_URL}/agendament`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async getBookingById(
    id: string, 
    token: string
  ): Promise<BookingResponse> {
    const response = await axios.get<BookingResponse>(
      `${API_URL}/agendament/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async cancelBooking(
    id: string, 
    token: string
  ): Promise<BookingResponse> {
    const response = await axios.delete<BookingResponse>(
      `${API_URL}/agendament/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};