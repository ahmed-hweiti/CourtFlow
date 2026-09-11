import axios from 'axios'
import type { Court } from '../types/Court'

const API_BASE_URL = 'http://localhost:3000'

export async function getCourts(): Promise<Court[]> {
  const response = await axios.get<Court[]>(`${API_BASE_URL}/courts`)
  return response.data
}
