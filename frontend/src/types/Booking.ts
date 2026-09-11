import type { Court } from './Court'

export interface Booking {
  id: number
  customerName: string
  customerEmail: string
  bookingDate: string
  startTime: string
  createdAt: string
  courtId: number
  court: Court
}

export interface CreateBookingData {
  courtId: number
  customerName: string
  customerEmail: string
  bookingDate: string
  startTime: string
}