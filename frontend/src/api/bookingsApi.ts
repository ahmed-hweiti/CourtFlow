import axios from 'axios'
import type { Booking, CreateBookingData } from '../types/Booking'

const API_BASE_URL = 'http://localhost:3000'

export async function getBookings(): Promise<Booking[]> {
  const response = await axios.get<Booking[]>(`${API_BASE_URL}/bookings`)
  return response.data
}

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const response = await axios.post<Booking>(`${API_BASE_URL}/bookings`, data)
  return response.data
}

export async function cancelBooking(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/bookings/${id}`)
}